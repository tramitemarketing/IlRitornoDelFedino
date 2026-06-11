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

/** Capitolo della biografia (titolo + paragrafi, citazione/elenco opzionali) */
export interface BioChapter {
  heading: string;
  quote?: string;
  paragraphs: string[];
  items?: { term: string; desc: string }[];
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
    name: 'La parte sbagliata della strada',
    /** Sottotitolo / claim della sezione ('' per nasconderlo) */
    subtitle: '',
    /** Testo introduttivo mostrato tra il bottone Spotify e il player */
    intro: [
      "Ci sono strade che non si incrociano sotto la luce del sole, ma nei vicoli ciechi dove il fumo delle sigarette si confonde con la nebbia del crepuscolo. È lì, dalla parte sbagliata della strada, che si muove l'esistenza di Iacopo Fedi. Un'anima divisa tra il rigore della speculazione filosofica e il richiamo sulfureo del blues, un cammino notturno dove ogni passo risuona come un accordo minore su una chitarra consumata dal fango e dal tempo.",
      "Nato con il blues nel sangue – nato blues dappertutto – Iacopo ha trasformato la sua vita in un'evocazione continua, muovendosi costantemente nell'ombra dei grandi miti della musica del diavolo e della crisi del pensiero moderno.",
    ],
    /**
     * Layout della sezione episodi:
     *  - 'link'    → solo bottoni: "Approfondisci la storia" + "Ascolta su
     *               Spotify" (primo episodio) + YouTube. ATTUALE.
     *  - 'grid'    → griglia di card che aprono Spotify (via API/link).
     *  - 'show'    → player ufficiale Spotify dello show.
     *  - 'preview' → solo titolo + bottone "Segui su Spotify".
     */
    layout: 'link' as 'link' | 'show' | 'grid' | 'preview',
    /** Link al primo episodio (bottone "Ascolta su Spotify") */
    episodeUrl: 'https://open.spotify.com/episode/4VpuNyovwrGMA8BRmHBTSD',
    /** Etichetta del bottone che porta alla bio completa */
    storyButton: 'Approfondisci la storia',
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

  /** Biografia (long-form, mostrata in fondo) */
  bio: {
    eyebrow: 'Il professore',
    name: 'Iacopo Fedi',
    /** Bio fattuale mostrata sotto il nome */
    intro: [
      "Iacopo Fedi è un professore di Storia/Filosofia e musicista, nato ad Ascoli Piceno (Marche, Italia) il 19/08/1987. All'età di circa quindici anni, l'incontro fulminante con il blues insieme a Elio segna l'inizio di un percorso artistico ed esistenziale profondo. Da quel momento la musica diventa una vocazione assoluta, una dimensione per cui spendersi interamente.",
      "Parallelamente all'attività musicale, la sua ricerca si sviluppa attraverso una densa riflessione filosofica e politica. Al centro della sua indagine si collocano la complessa dialettica tra il bene e il male, l'analisi profonda del concetto di unione e l'esame critico delle dinamiche che muovono la moderna democrazia contemporanea. In questo quadro intellettuale, il dialogo si estende inevitabilmente all'evoluzione delle macchine e all'impatto socioculturale della musica stessa.",
    ],
    sections: [
      {
        heading: "L'Angelo delle Macerie e il Silenzio di Roma",
        paragraphs: [
          "Prima di perdersi nei fumi dei club e nei patti stringati ai crocicchi a mezzanotte, la mente di Iacopo si è nutrita delle ombre millenarie di Roma. Nella Capitale ha consacrato i suoi studi alla Storia e alla Filosofia, ma lontano da qualsiasi rassicante retorica accademica.",
          "La sua ricerca si è concentrata sui territori più aridi e affascinanti del pensiero del Novecento, focalizzandosi sulla figura teorico-critica di Walter Benjamin. Iacopo ha scavato nelle profondità dell'attesa messianica della storia, laddove il tempo lineare si spezza e si inceppa. Al centro del suo immaginario filosofico si staglia l'Angelus Novus: l'angelo apocalittico che vorrebbe trattenersi per risvegliare i morti e ricomporre l'infranto, ma le cui ali vengono rapite da una tempesta inarrestabile che spira dal paradiso. Quella tempesta è il futuro, che lo spinge inesorabilmente in avanti, mentre davanti a lui le macerie della storia si accumulano fino al cielo.",
        ],
      },
      {
        heading: 'I Cinque Sigilli: Iacopo Fedi and the Family Bones',
        quote: 'Il blues non è una scelta, è una condanna originaria che si sconta una nota alla volta.',
        paragraphs: [
          "Dal fango di quella condanna e dal legno delle chitarre sono emersi cinque dischi, cinque capitoli di un grimorio musicale oscuro e viscerale, interamente disponibili su Spotify sotto il nome di Iacopo Fedi and the Family Bones.",
          "A guidare questa danza scheletrica e potente è la sua voce rauca, graffiata dal sale, dalla notte e dai rimpianti, capace di evocare spettri legati alla terra e al cemento. La musica dei Family Bones è un rituale sotterraneo: una miscela di accordi sporchi e ritmiche ossessive che sembrano provenire direttamente da quel leggendario incrocio dove i musicisti barattavano l'anima in cambio di un riff immortale. Non c'è redenzione nelle sue tracce, solo la cruda verità di chi canta la notte per non uscirne pazzo.",
        ],
      },
      {
        heading: 'Frequenze Fantasma dal Lato Oscuro',
        paragraphs: [
          "Il racconto di Iacopo Fedi non si esaurisce sul palco o tra le pagine dei libri. La sua voce e le sue visioni si propagano nell'etere attraverso la dimensione dei podcast, segnali radio lanciati nell'oscurità per chi, come lui, sa orientarsi solo quando si spegne la luce della città.",
          "Nessuna mappa, nessuna via maestra. Per chi ha scelto di vivere e creare dalla parte sbagliata della strada, restano solo il riverbero di un amplificatore valvolare, il battito cardiaco di una storia che stringe i denti e lo sguardo fisso di quell'angelo benjaminiano che continua a volare al contrario, incontro alla tempesta.",
        ],
      },
      {
        heading: "Il Ritorno dall'Ombra: La Porta Sublime e la Geopolitica della Seduzione",
        paragraphs: [
          "Dopo un anno di assoluto silenzio radiofonico, le frequenze fantasma tornano a vibrare. Perché questo anno di assenza? Perché il mondo esterno, soffocato da una globalizzazione asettica e prevedibile, era diventato troppo luminoso, piatto, privo di attrito. I podcast moderni si sono trasformati in algoritmi di intrattenimento pulito, e per chi vive dalla parte sbagliata della strada, quel vuoto andava riempito di nuovo con la vernice nera della storia e del mito.",
          "Il ritorno al microfono non è una semplice ripresa: è un'escursione notturna nei territori più oscuri e labirintici dell'Impero Ottomano. Iacopo Fedi traccia un ponte impossibile tra la decadenza della Sublime Porta e le miserie sentimentali della modernità iper-connessa, firmando una nuova serie di podcast dominata da un'unica, bizzarra e magnetica ossessione: l'arte ottomana della seduzione applicata a un appuntamento per una pizza.",
          "L'espediente narrativo è una discesa agli inferi: un moderno turista, alienato dai voli low-cost e dai pacchetti vacanze tutti uguali, si perde tra i vicoli di Istanbul. Ma non si perde nello spazio, si perde nel tempo. Scivola nelle ombre del XVII secolo, tra fumi di oppio, intrighi di corte, spie del Gran Visir e sussurri di harem. Da quell'oscurità millenaria, il turista lancia il suo podcast, usando le spietate e raffinate strategie della geopolitica ottomana per insegnare come sopravvivere a un primo appuntamento oggi.",
        ],
      },
      {
        heading: 'Il Rituale del Divan: Come comportarsi con una ragazza',
        paragraphs: [
          'Nella visione oscura di questo podcast, portare fuori una ragazza non è un "match" su un\'applicazione; è una campagna militare e diplomatica che richiede la stessa pazienza dell\'assedio di Costantinopoli.',
        ],
        items: [
          {
            term: 'La Diplomazia del Silenzio',
            desc: "L'uomo moderno parla troppo, si giustifica, riempie i vuoti con l'ansia. L'approccio ottomano esige il magnetismo del Sultano. Il comportamento deve essere felpato, imperscrutabile. Si ascolta come il Gran Visir dietro la grata del Divan: apparentemente distanti, ma fatalmente attenti a ogni dettaglio.",
          },
          {
            term: "La Strategia dell'Harem (Il Mistero)",
            desc: "Non si svela mai l'intera corte al primo incontro. La seduzione è fatta di corridoi d'ombra, di veli che si sollevano uno alla volta. Mostrare subito tutto di sé è un errore da profani. Bisogna lasciare che sia l'immaginazione di lei a fare il lavoro più faticoso.",
          },
        ],
      },
      {
        heading: "I Sigilli sul Menu: Quale pizza scegliere per l'assedio",
        paragraphs: [
          "Il fulcro del podcast tocca il paradosso più profondo: come si ordina una pizza applicando le influenze del Medio Oriente e dei Balcani sottomessi alla Mezzaluna? Il turista perduto nel tempo non ha dubbi: la scelta del cibo è il primo trattato di pace o la prima dichiarazione di guerra.",
        ],
      },
    ] as BioChapter[],
  },

  /** Contatti e social (lascia vuoto '' per nasconderli) */
  contact: {
    email: '',
    instagram: 'https://www.instagram.com/il_fedino/',
    youtube: 'https://www.youtube.com/user/iacopofedi',
    linkedin: '',
  },

  /** Credito nel footer */
  madeBy: {
    label: 'Made by Tramite',
    url: 'https://www.instagram.com/tramite.marketing/',
    /** Logo: metti un file in /public (es. '/tramite.svg') o '' per il segno di default */
    logo: '',
  },
};

export type SiteConfig = typeof siteConfig;
