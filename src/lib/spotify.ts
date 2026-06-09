/**
 * Recupero episodi da Spotify (build-time, Client Credentials Flow).
 * ------------------------------------------------------------------
 * Serve impostare le variabili d'ambiente:
 *   SPOTIFY_CLIENT_ID
 *   SPOTIFY_CLIENT_SECRET
 * (crea un'app gratis su https://developer.spotify.com/dashboard)
 *
 * In locale: copia .env.example in .env e compila i valori.
 * Su Netlify/Vercel: aggiungile nelle Environment Variables del progetto.
 *
 * Se le credenziali mancano o la rete non è disponibile, le funzioni
 * restituiscono [] senza far fallire la build: la UI ricade sul player
 * unico dello show o sugli episodi inseriti a mano nel config.
 */

export interface Episode {
  id: string;
  name: string;
  description: string;
  releaseDate: string;
  durationMs: number;
  image: string | null;
  url: string;
}

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API = 'https://api.spotify.com/v1';

/** Pulisce un valore env da spazi e virgolette accidentali. */
function clean(v: string | undefined): string {
  return (v ?? '').trim().replace(/^['"]|['"]$/g, '');
}

function getCreds() {
  // Astro/Vite espone le env non-PUBLIC solo lato server/build.
  const id = clean(import.meta.env.SPOTIFY_CLIENT_ID ?? process.env.SPOTIFY_CLIENT_ID);
  const secret = clean(import.meta.env.SPOTIFY_CLIENT_SECRET ?? process.env.SPOTIFY_CLIENT_SECRET);
  return id && secret ? { id, secret } : null;
}

async function getToken(): Promise<string | null> {
  const creds = getCreds();
  if (!creds) {
    console.warn(
      '[spotify] Credenziali assenti al build: SPOTIFY_CLIENT_ID/SECRET non trovate. ' +
        'Su Vercel/Netlify aggiungile alle Environment Variables (ambiente Production) ' +
        'e fai un nuovo deploy.',
    );
    return null;
  }
  try {
    const basic = Buffer.from(`${creds.id}:${creds.secret}`).toString('base64');
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
      console.warn(
        `[spotify] Token non ottenuto (HTTP ${res.status}). ` +
          'Controlla che Client ID/Secret siano corretti.',
      );
      return null;
    }
    const data = await res.json();
    return data.access_token ?? null;
  } catch (e) {
    console.warn('[spotify] Errore di rete nel recupero del token:', e);
    return null;
  }
}

/**
 * Recupera fino a `limit` episodi dello show indicato.
 * Gestisce la paginazione dell'API (50 per pagina).
 */
export async function getShowEpisodes(
  showId: string,
  market = 'IT',
  limit = 50,
): Promise<Episode[]> {
  if (!showId) return [];
  const token = await getToken();
  if (!token) return [];

  const out: Episode[] = [];
  try {
    let url: string | null =
      `${API}/shows/${showId}/episodes?market=${market}&limit=${Math.min(50, limit)}`;
    while (url && out.length < limit) {
      const res: Response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn(
          `[spotify] Errore nel recupero episodi (HTTP ${res.status}) per show ${showId}, ` +
            `market ${market}. Verifica showId e market.`,
        );
        break;
      }
      const data = await res.json();
      for (const it of data.items ?? []) {
        if (!it) continue;
        out.push({
          id: it.id,
          name: it.name,
          description: it.description ?? '',
          releaseDate: it.release_date ?? '',
          durationMs: it.duration_ms ?? 0,
          image: it.images?.[0]?.url ?? null,
          url: it.external_urls?.spotify ?? `https://open.spotify.com/episode/${it.id}`,
        });
      }
      url = data.next ?? null;
    }
  } catch (e) {
    console.warn('[spotify] Errore di rete nel recupero episodi:', e);
    return out;
  }
  console.log(`[spotify] Episodi recuperati: ${out.length} (show ${showId}).`);
  return out.slice(0, limit);
}

/** Formatta una durata in ms come "12 min" o "1 h 03 min". */
export function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin} min`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h} h ${String(m).padStart(2, '0')} min`;
}

/** Formatta "2024-05-12" come "12 mag 2024". */
export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
}
