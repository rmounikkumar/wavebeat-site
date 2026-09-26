// All page content — plain text and structure, unchanged from the original
// markup. Edit copy here, not in the components.

export const DL =
  'https://github.com/rmounikkumar/wavebeat-with-lyrics/releases/latest/download/WaveBeat.apk';

export const NAV_LINKS = [
  { href: '#the-app', label: 'The app' },
  { href: '#features', label: 'What ships' },
  { href: '#install', label: 'Install' }
];

export const PANELS = [
  {
    no: '01',
    name: 'Home',
    img: '/assets/screenshots/home.png',
    alt: 'WaveBeat home screen: a grid of album tiles for the songs on the device, with a search icon and Home, Library, Audio and Settings tabs.',
    caption: 'Open it. Your library’s already there.',
    detail: 'Every song on this device shows up on the Home grid the moment you open the app. Nothing to import, nothing to sign into.',
    anno: 'One screen, no setup',
    eager: true,
    first: true
  },
  {
    no: '02',
    name: 'Library',
    img: '/assets/screenshots/library.png',
    alt: 'WaveBeat library: the full list of songs on the device, with search and per-tab navigation.',
    caption: 'Find anything you own, fast.',
    detail: 'Search by title or artist, and hop between the Songs, Playlists and Favorites tabs without losing your place.',
    anno: 'Search + tabs + filters',
    flip: true
  },
  {
    no: '03',
    name: 'Long-press',
    img: '/assets/screenshots/menu.png',
    alt: 'The long-press quick menu on a song: Play next, Add to playlist, Remove from favorites, and Delete.',
    caption: 'Hold a song. Pick what happens next.',
    detail: 'Play it next, add it to a playlist, favorite it, or delete it — the menu opens right there on the row, no page-turning.',
    anno: 'Play next queues it straight after the current track'
  },
  {
    no: '04',
    name: 'Lyrics',
    img: '/assets/screenshots/lyrics.png',
    alt: 'The WaveBeat player with the lyrics panel open: synced lines scroll with the music.',
    caption: 'Slide the lyrics open. The words follow the music.',
    detail: 'Tap the lyrics button and synced lines scroll line-by-line with the beat — English, Hindi, whatever’s available, fetched live.',
    anno: 'Synced from LRCLIB, line by line',
    flip: true
  },
  {
    no: '05',
    name: 'Audio',
    img: '/assets/screenshots/audio.png',
    alt: 'WaveBeat Audio Enhancement: equalizer presets Flat, Pop, Rock, Jazz, Bass Boost, Treble and Vocal, plus 8D Rotation, 3D Virtualizer, Bass Boost, Reverb and Loudness switches.',
    caption: 'Every song has an EQ it loves.',
    detail: 'Seven presets — Flat, Pop, Rock, Jazz, Bass Boost, Treble, Vocal — apply the moment you tap them. Layer on 8D rotation, 3D virtualizer, reverb or loudness, then set the strength with one slider.',
    anno: 'Auto-Enhance matches a preset to each track'
  },
  {
    no: '06',
    name: 'Settings',
    img: '/assets/screenshots/settings.png',
    alt: 'WaveBeat Settings: Auto-Enhance plus tweaks for the animated logo, auto-next track, auto-resume, track and nav-bar haptics, keep-screen-awake and online lyrics.',
    caption: 'Set it once. It remembers the rest.',
    detail: 'Auto-resume where you left off, pause after a track, keep the screen awake, feel haptics on every tap — and let Auto-Enhance suggest the right EQ preset for each song.',
    anno: 'Auto-resume · keep-awake · online lyrics · haptics',
    flip: true
  }
];

export const DIFF_ROWS = [
  { them: 'A store with a player bolted on', us: 'Your files are the whole catalog' },
  { them: 'Synced lyrics locked behind the plan', us: 'Lyrics scroll with the track, fetched live' },
  { them: 'Sign up before you can play anything', us: 'Open it — your library is already there' },
  { them: 'Menus, sub-menus, page-turns for every action', us: 'Long-press a song: play next, playlist, favorite, delete' },
  { them: 'One sound for everyone, take it or leave it', us: 'Seven EQ presets, 8D rotation, virtualizer, reverb — one tap' },
  { them: 'Ads and a feed of things to buy', us: 'Nothing to buy, nothing tracking you' }
];

export const FEATURE_ROWS = [
  { no: '01', title: 'Plays your files', body: 'MP3, AAC, FLAC, WAV and more — read straight from the device, in the order you like.' },
  { no: '02', title: 'Synced lyrics', body: 'Fetched live while a song plays and scrolled in time, so you can sing along without losing your place.' },
  { no: '03', title: 'Favorites & playlists', body: 'Build a Favorites list or your own playlists — both a long-press away on any song.' },
  { no: '04', title: 'Play next', body: 'Queue a song to play right after the current one, without shuffling the rest of the queue.' },
  { no: '05', title: 'Sleep timer', body: 'Set it and drift off — the music stops itself when the timer runs out.' },
  { no: '06', title: 'Dark, end to end', body: 'Built for night listening: a deep interface with no glaring white screens anywhere.' }
];

export const INSTALL_ROWS = [
  {
    no: '01',
    title: 'Download the APK',
    body: <p>Tap <a href={DL} download>the download button</a> from your phone's browser. It's 8.1 MB.</p>
  },
  {
    no: '02',
    title: 'Tap the file',
    body: <p>Open the downloaded <code>.apk</code>. Your phone may ask to allow “unknown sources” — allow it for WaveBeat.</p>
  },
  {
    no: '03',
    title: 'Install & open',
    body: <p>Confirm the install and open WaveBeat. Your music is already there — no import, no setup.</p>
  }
];