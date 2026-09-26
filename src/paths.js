// Public asset URLs that the page builds at runtime (img src, the lanyard
// card model, the card faces). Vite only rewrites *imported* asset paths, so
// these go through BASE_URL — otherwise they would 404 when the site is
// served from a sub-path such as GitHub Pages' /wavebeat-site/.
const BASE = import.meta.env.BASE_URL;

export function asset(path) {
  return `${BASE}assets/${path}`;
}
