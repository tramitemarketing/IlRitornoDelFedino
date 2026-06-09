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

  /** Sezione podcast */
  podcast: {
    /** Nome del podcast */
    name: 'Il Ritorno del Fedino — Podcast',
    /** Sottotitolo / claim della sezione */
    subtitle: 'Conversazioni, lezioni e divagazioni. Episodi nuovi ogni settimana.',
    /**
     * ID dello SHOW Spotify per il player completo della serie.
     * Lo trovi nell'URL: open.spotify.com/show/XXXXXXXX
     * Lascia stringa vuota '' se vuoi mostrare solo i singoli episodi.
     */
    showId: '5oWtSGw6X75uomzzW6UK9V',
    /** Episodi in evidenza (player singoli) */
    episodes: [
      // Esempio: { id: '4rOoJ6Egrf8K2IrywzwOMk', title: 'Episodio pilota' },
    ] as SpotifyEpisode[],
    /** Link diretto al profilo Spotify (per il bottone "Segui") */
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
