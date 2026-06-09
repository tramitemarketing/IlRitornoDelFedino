/**
 * CONFIGURAZIONE CENTRALE DEL SITO
 * --------------------------------
 * Questo è l'unico file da modificare per cambiare i contenuti principali.
 * Niente codice da toccare: solo testo e ID.
 */

export interface SpotifyEpisode {
  /** ID episodio Spotify. Lo trovi nell'URL: open.spotify.com/episode/XXXXXXXX */
  id: string;
  /** Titolo mostrato sopra il player (opzionale, solo descrittivo) */
  title?: string;
}

export const siteConfig = {
  /** Nome che appare nel browser e nella SEO */
  siteName: 'Il Ritorno del Fedino',
  /** Descrizione per Google e anteprime social */
  description:
    'Sito personale e podcast di Iacopo Fedi — voce, idee e conversazioni. Ascolta gli episodi su Spotify.',
  /** Lingua del sito */
  lang: 'it',

  /** Dati del professore */
  professor: {
    name: 'Iacopo Fedi',
    /** Frase d'effetto mostrata nella home animata */
    tagline: 'Pensiero, voce e ritorno.',
    /** Materia / ambito (usata in bio e SEO) */
    field: 'Materia da definire',
  },

  /** Intro animata (schermata nera col titolo -> video -> nero) */
  intro: {
    /** Titolo mostrato sullo schermo nero iniziale */
    titleScreen: 'Il Ritorno del Fedino',
    /** Sottotitolo opzionale sotto il titolo iniziale */
    titleSub: 'di Iacopo Fedi',
    /**
     * Video dell'intro (scrubbato dallo scroll, reversibile).
     * Metti i file in /public e indica qui i percorsi.
     * Se vuoto, parte la scena vettoriale di fallback (canvas).
     * Consiglio: fornisci sia MP4 (H.264) sia WebM (VP9/AV1).
     */
    videoSrc: '',          // es: '/intro.mp4'
    videoWebm: '',         // es: '/intro.webm'
    /** Immagine poster (ultimo frame nero), opzionale */
    poster: '',
  },

  /** Sezione podcast */
  podcast: {
    /** Nome del podcast */
    name: 'Il Ritorno del Fedino',
    /** Sottotitolo / claim della sezione */
    subtitle: 'Conversazioni, lezioni e divagazioni. Tutti gli episodi, qui.',
    /**
     * ID dello SHOW Spotify.
     * Lo trovi nell'URL: open.spotify.com/show/XXXXXXXX
     * Usato sia per il fallback (player unico) sia per recuperare
     * automaticamente la lista episodi via API (vedi src/lib/spotify.ts).
     */
    showId: '5oWtSGw6X75uomzzW6UK9V',
    /**
     * Recupero automatico episodi via Spotify API.
     * Richiede le variabili d'ambiente SPOTIFY_CLIENT_ID e
     * SPOTIFY_CLIENT_SECRET (vedi .env.example).
     */
    autoFetch: true,
    /** Mercato per l'API Spotify (codice paese) */
    market: 'IT',
    /** Numero massimo di episodi mostrati in griglia */
    maxEpisodes: 36,
    /**
     * Episodi inseriti a mano (fallback se autoFetch è off o l'API
     * non è disponibile). ID dall'URL open.spotify.com/episode/XXXX
     */
    episodes: [
      // Esempio: { id: '4rOoJ6Egrf8K2IrywzwOMk', title: 'Episodio pilota' },
    ] as SpotifyEpisode[],
    /** Link diretto allo show Spotify (bottone "Segui") */
    spotifyUrl: 'https://open.spotify.com/show/5oWtSGw6X75uomzzW6UK9V',
  },

  /** Biografia (mostrata in fondo, in secondo piano rispetto alla home) */
  bio: {
    heading: 'Chi è',
    paragraphs: [
      'Breve biografia del professore. Sostituisci questo testo con la presentazione reale: percorso, ambiti di ricerca, cosa lo appassiona.',
      'Un secondo paragrafo opzionale per raccontare il progetto del podcast e il motivo del "ritorno".',
    ],
  },

  /** Contatti e social (lascia vuoto '' per nasconderli) */
  contact: {
    email: '',
    instagram: '',
    youtube: '',
    linkedin: '',
  },
};

export type SiteConfig = typeof siteConfig;
