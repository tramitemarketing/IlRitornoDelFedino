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

/** Esito del recupero, usato anche per mostrare un messaggio chiaro in pagina. */
export type FetchStatus =
  | 'ok'
  | 'no-creds'
  | 'token-error'
  | 'api-error'
  | 'empty'
  | 'network-error';

export interface EpisodesResult {
  episodes: Episode[];
  status: FetchStatus;
  detail?: string;
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

type TokenResult =
  | { token: string; userToken: boolean }
  | { error: 'no-creds' | 'token-error' | 'network-error'; detail?: string };

async function getToken(): Promise<TokenResult> {
  const creds = getCreds();
  if (!creds) {
    console.warn(
      '[spotify] Credenziali assenti al build: SPOTIFY_CLIENT_ID/SECRET non trovate. ' +
        'Su Vercel/Netlify aggiungile alle Environment Variables (ambiente Production) ' +
        'e fai un nuovo deploy.',
    );
    return { error: 'no-creds' };
  }
  // I podcast richiedono un TOKEN UTENTE: se c'è il refresh token lo usiamo
  // (niente 403), altrimenti ripieghiamo sul Client Credentials (solo musica).
  const refresh = clean(
    import.meta.env.SPOTIFY_REFRESH_TOKEN ?? process.env.SPOTIFY_REFRESH_TOKEN,
  );
  const body = refresh
    ? `grant_type=refresh_token&refresh_token=${encodeURIComponent(refresh)}`
    : 'grant_type=client_credentials';
  if (!refresh) {
    console.warn(
      '[spotify] Nessun SPOTIFY_REFRESH_TOKEN: uso Client Credentials, ma la lista ' +
        'episodi dei podcast verrà rifiutata da Spotify (403). Esegui "npm run spotify:auth".',
    );
  }
  try {
    const basic = Buffer.from(`${creds.id}:${creds.secret}`).toString('base64');
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!res.ok) {
      console.warn(`[spotify] Token non ottenuto (HTTP ${res.status}).`);
      return { error: 'token-error', detail: `HTTP ${res.status}` };
    }
    const data = await res.json();
    if (!data.access_token) return { error: 'token-error', detail: 'no access_token' };
    return { token: data.access_token, userToken: !!refresh };
  } catch (e) {
    console.warn('[spotify] Errore di rete nel recupero del token:', e);
    return { error: 'network-error', detail: String(e) };
  }
}

/**
 * Recupera fino a `limit` episodi dello show indicato (con paginazione).
 * Restituisce sempre uno stato, così la UI può spiegare un eventuale problema.
 */
export async function getShowEpisodes(
  showId: string,
  market = 'IT',
  limit = 50,
): Promise<EpisodesResult> {
  if (!showId) return { episodes: [], status: 'api-error', detail: 'showId mancante' };

  const tok = await getToken();
  if ('error' in tok) return { episodes: [], status: tok.error, detail: tok.detail };
  const token = tok.token;
  const tag = tok.userToken ? 'refresh:usato' : 'refresh:assente';
  const auth = { Authorization: `Bearer ${token}` };

  const mapItem = (it: any): Episode => ({
    id: it.id,
    name: it.name,
    description: it.description ?? '',
    releaseDate: it.release_date ?? '',
    durationMs: it.duration_ms ?? 0,
    image: it.images?.[0]?.url ?? null,
    url: it.external_urls?.spotify ?? `https://open.spotify.com/episode/${it.id}`,
  });

  const errMsg = async (res: Response) => {
    let msg = '';
    try {
      msg = (await res.json())?.error?.message || '';
    } catch {}
    return `HTTP ${res.status}${msg ? `: ${msg}` : ''}`;
  };

  const lim = Math.min(50, limit);
  let lastDetail = '';

  // Tentativi in ordine: episodi (con market, senza market), poi Get Show.
  const starts = [
    `${API}/shows/${showId}/episodes?market=${market}&limit=${lim}`,
    `${API}/shows/${showId}/episodes?limit=${lim}`,
  ];
  for (const start of starts) {
    const out: Episode[] = [];
    let url: string | null = start;
    let failed = false;
    try {
      while (url && out.length < limit) {
        const res: Response = await fetch(url, { headers: auth });
        if (!res.ok) {
          lastDetail = await errMsg(res);
          console.warn(`[spotify] Episodi KO (${lastDetail}) :: ${start}`);
          failed = true;
          break;
        }
        const data = await res.json();
        for (const it of data.items ?? []) if (it) out.push(mapItem(it));
        url = data.next ?? null;
      }
    } catch (e) {
      console.warn('[spotify] Errore di rete (episodi):', e);
      return { episodes: out, status: 'network-error', detail: String(e) };
    }
    if (!failed && out.length > 0) {
      console.log(`[spotify] Episodi recuperati: ${out.length} (show ${showId}).`);
      return { episodes: out.slice(0, limit), status: 'ok' };
    }
    if (!failed && out.length === 0) lastDetail = lastDetail || 'risposta vuota';
  }

  // Fallback: "Get Show" con episodi annidati (a volte passa quando l'altro dà 403)
  try {
    const res = await fetch(`${API}/shows/${showId}?market=${market}`, { headers: auth });
    if (res.ok) {
      const data = await res.json();
      const out: Episode[] = [];
      let page = data.episodes;
      while (page && out.length < limit) {
        for (const it of page.items ?? []) if (it) out.push(mapItem(it));
        if (page.next && out.length < limit) {
          const r2 = await fetch(page.next, { headers: auth });
          if (!r2.ok) break;
          page = await r2.json();
        } else break;
      }
      if (out.length > 0) {
        console.log(`[spotify] Episodi recuperati via Get Show: ${out.length}.`);
        return { episodes: out.slice(0, limit), status: 'ok' };
      }
    } else {
      lastDetail = await errMsg(res);
      console.warn(`[spotify] Get Show KO (${lastDetail}).`);
    }
  } catch (e) {
    console.warn('[spotify] Errore di rete (Get Show):', e);
  }

  return {
    episodes: [],
    status: lastDetail.startsWith('HTTP') ? 'api-error' : 'empty',
    detail: `${lastDetail} · ${tag}`,
  };
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
