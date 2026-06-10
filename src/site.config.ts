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
    /** Sottotitolo opzionale sotto il titolo iniziale ('' per nasconderlo) */
    titleSub: '',
    /**
     * Video dell'intro (scrubbato dallo scroll, reversibile).
     * Se vuoto, parte la scena vettoriale di fallback (canvas).
     */
    videoSrc: '/intro.mp4',
    videoWebm: '/intro.webm',
    /** Immagine poster (ultimo frame), opzionale */
    poster: '/poster.jpg',
    /**
     * Lunghezza dello scroll dell'intro in unità vh.
     * Più alto = animazione più LENTA e fluida (più scroll per scorrere il video).
     */
    scrollVh: 650,
    /**
     * Quanto "ammorbidire" lo scrubbing: 0.06 = molto fluido/lento,
     * 0.2 = più reattivo. Valori bassi = più cinematografico.
     */
    smoothing: 0.09,
    /**
     * Filtri CSS applicati ai fotogrammi del video (color grade noir).
     * Esempi: 'contrast(1.15) brightness(0.85) saturate(0.8)'
     */
    filter: 'contrast(1.12) brightness(0.82) saturate(0.8)',
    /** Velo di colore (grade) sopra il video. Vuoto '' per disattivarlo. */
    gradeColor: '#04282e',
    /** Intensità del velo di colore (0–1) */
    gradeOpacity: 0.28,
  },

  /** Sezione podcast */
  podcast: {
    /** Etichetta sopra il titolo ('' per nasconderla) */
    eyebrow: '',
    /** Titolo della sezione */
    name: 'Dalla parte sbagliata della strada',
    /** Sottotitolo / claim della sezione ('' per nasconderlo) */
    subtitle: '',
    /**
     * Mostra gli episodi (griglia/player). false = modalità ANTEPRIMA:
     * resta solo il titolo + il bottone "Segui su Spotify".
     */
    showEpisodes: false,
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
