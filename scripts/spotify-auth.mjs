#!/usr/bin/env node
/**
 * Autorizzazione Spotify (una tantum) per ottenere un REFRESH TOKEN.
 * --------------------------------------------------------------------
 * I podcast richiedono un token UTENTE: questo script fa il login una
 * volta e stampa il refresh token da incollare nelle variabili d'ambiente
 * (SPOTIFY_REFRESH_TOKEN) in locale (.env) e su Vercel/Netlify.
 *
 * USO:
 *   1) Nelle impostazioni dell'app Spotify aggiungi il Redirect URI:
 *        http://127.0.0.1:8888/callback
 *   2) Lancia:
 *        npm run spotify:auth
 *      (oppure: node scripts/spotify-auth.mjs <CLIENT_ID> <CLIENT_SECRET>)
 *   3) Apri il link stampato, accedi e approva.
 *   4) Copia il refresh token mostrato.
 *
 * Le credenziali vengono lette da: argomenti CLI, variabili d'ambiente,
 * oppure dal file .env nella cartella del progetto.
 */
import http from 'node:http';
import fs from 'node:fs';
import { URL } from 'node:url';

const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const PORT = 8888;
const SCOPE = 'user-read-playback-position';

// --- Lettura credenziali (CLI > env > .env) ---
function fromDotEnv(key) {
  try {
    const txt = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
    const m = txt.match(new RegExp(`^${key}\\s*=\\s*(.*)$`, 'm'));
    return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
  } catch {
    return '';
  }
}
const CLIENT_ID =
  process.argv[2] || process.env.SPOTIFY_CLIENT_ID || fromDotEnv('SPOTIFY_CLIENT_ID');
const CLIENT_SECRET =
  process.argv[3] || process.env.SPOTIFY_CLIENT_SECRET || fromDotEnv('SPOTIFY_CLIENT_SECRET');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '\n❌ Mancano le credenziali.\n' +
      '   Passa: node scripts/spotify-auth.mjs <CLIENT_ID> <CLIENT_SECRET>\n' +
      '   oppure mettile in un file .env (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET).\n',
  );
  process.exit(1);
}

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
  }).toString();

console.log('\n=== Autorizzazione Spotify ===');
console.log('\n1) Assicurati che questo Redirect URI sia registrato nell\'app Spotify:');
console.log(`   ${REDIRECT_URI}`);
console.log('\n2) Apri questo link nel browser, accedi e premi "Agree":\n');
console.log('   ' + authUrl + '\n');
console.log('In attesa del reindirizzamento su ' + REDIRECT_URI + ' ...\n');

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) {
    res.writeHead(404);
    res.end();
    return;
  }
  const code = new URL(req.url, `http://127.0.0.1:${PORT}`).searchParams.get('code');
  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Codice mancante. Riprova.');
    return;
  }
  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });
    const data = await tokenRes.json();
    if (!tokenRes.ok || !data.refresh_token) {
      throw new Error(JSON.stringify(data));
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      '<body style="font-family:sans-serif;background:#000;color:#eef3f3;padding:3rem">' +
        '<h2>✅ Fatto!</h2><p>Torna al terminale e copia il refresh token. Puoi chiudere questa pagina.</p></body>',
    );

    console.log('\n✅ REFRESH TOKEN ottenuto. Copialo dove serve:\n');
    console.log('SPOTIFY_REFRESH_TOKEN=' + data.refresh_token + '\n');
    console.log('   → in locale: aggiungilo al file .env');
    console.log('   → su Vercel/Netlify: aggiungilo alle Environment Variables (Production) e rifai il deploy.\n');
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Errore nello scambio del token. Vedi il terminale.');
    console.error('\n❌ Errore:', e.message, '\n');
  } finally {
    server.close();
    process.exit(0);
  }
});

server.listen(PORT);
