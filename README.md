# WaveBeat — landing page

The marketing site for [WaveBeat](https://github.com/rmounikkumar/wavebeat-with-lyrics) — a free,
no-account Android music player. React single-page site: hero, app walkthrough with real device
screenshots, feature list, install steps, and a download button wired to the GitHub release.

Converted from a plain static page to React **1:1** — same markup, same CSS, same behaviour.

## Stack

React 18 + Vite 5. The original `css/tokens.css` and `css/style.css` are unchanged and imported
directly; the page content lives in `src/`. The APK is **not** hosted here; the download buttons
point at the GitHub release asset:

```
https://github.com/rmounikkumar/wavebeat-with-lyrics/releases/latest/download/WaveBeat.apk
```

When a new version is released, `latest/download` automatically resolves to the newest asset —
no site changes needed.

### The lanyard intro

Visitors first get a full-screen intro: the react-bits **Lanyard** card hanging in the site's
aurora sky, with the WaveBeat mark and the "Plays the files on your phone. Shows the words, too."
quote on the face. **Drag the card** to fade the intro away and reveal the hero. A `skip intro`
link and the `Esc` key also dismiss it, and the dismissal is remembered for the rest of the
browser session (`sessionStorage`), so it only ever appears once per visit.

The intro is code-split (`React.lazy`) because three.js + rapier are ~1 MB gzipped — the page
itself stays at ~52 kB gzipped, and returning visitors never download the 3D chunk at all.

| Piece | Where |
| --- | --- |
| Card model | `public/assets/lanyard/card.glb` (react-bits) |
| Band texture | `public/assets/lanyard/lanyard.png` (react-bits) |
| Card faces | `public/assets/lanyard/card-front.png`, `card-back.png` (theme art, 800×1208 = the card's UV rect) |

Swap the face images by replacing those two PNGs — keep the 800×1208 aspect (or the faces get
cropped) and nothing else changes. Card framing lives in `src/components/IntroGate.jsx`
(`position`, `lanyardWidth`).

## Commands

```
npm install        install dependencies
npm run dev        local dev server (http://localhost:5173)
npm run build      production build → dist/
npm run preview    preview the production build
```

## Structure

```
index.html                 Vite shell — head, body classes, aurora canvas + shaders, #root
src/main.jsx               entry — imports the CSS, gates content behind .anim, mounts App
src/App.jsx                page layout + the site-wide behaviours (entrance, reveals, sticky CTA)
src/components/Aurora.jsx  WebGL background (react-bits shader) — also renders the intro's own sky
src/components/IntroGate.jsx  the full-screen lanyard intro (lazy-loaded; reveal, Esc, skip)
src/components/IntroGate.css  intro overlay styles (loaded with the main bundle)
src/components/Lanyard.jsx react-bits lanyard port (rapier joints, drag to reveal)
src/components/Lanyard.css react-bits lanyard base styles
src/components/WarpText.jsx  split heading (react-bits warp feel, CSS port)
src/data.jsx               all page content (panels, rows) — edit copy here, not in markup
src/paths.js               base-aware URLs for runtime assets (screenshots, card model/faces)
css/tokens.css             design tokens (OKLCH palette lifted from the app) — unchanged
css/style.css              page styles (Workbench macrostructure) — unchanged
public/assets/lanyard/     card.glb + band texture (react-bits) + the two themed card faces
public/assets/screenshots/ real device captures (1080×2400), served at /assets/screenshots/
```

Screenshots were captured from a running build of the app — Home, Library, the long-press
quick menu, the synced-lyrics player, the Audio Enhancement equalizer, and Settings.

## Deploying — GitHub Pages (live)

The site is published by `.github/workflows/deploy.yml`: every push to `main` runs
`npm run build` and publishes `dist/` to **https://rmounikkumar.github.io/wavebeat-site/**.

Because Pages serves from the `/wavebeat-site/` sub-path, `vite.config.js` sets
`base: '/wavebeat-site/'` for production builds, and runtime asset URLs in
`src/data.jsx`, `Lanyard.jsx` and `IntroGate.jsx` go through `asset()` in
`src/paths.js` (which prefixes `import.meta.env.BASE_URL`). If you move to a
custom domain, set `SITE_BASE=/` for the build (repo Settings → Pages → custom
domain, plus `SITE_BASE=/ npm run build`) — no other change needed.

To deploy by hand: `npm run build`, then push `dist/` to the `gh-pages` branch
(or set the Pages source to that branch).

### Vercel / Netlify (alternative)

Both auto-detect the Vite setup — build `npm run build`, output `dist`. Because
they serve from a domain root, build with `SITE_BASE=/ npm run build`.

*Keep the APK on GitHub either way* — the page only links to it.

## Linking the screenshots after a fresh capture

If you ever re-capture device screenshots, drop new PNGs into `public/assets/screenshots/`
keeping the existing filenames (`home.png`, `library.png`, `menu.png`, `lyrics.png`,
`audio.png`, `settings.png`, each 1080×2400) and nothing else changes.

## The old static version

The pre-React build is preserved in `../wavebeat-site-static-backup/` if you ever need it.