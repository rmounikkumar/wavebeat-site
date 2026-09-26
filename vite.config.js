import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// WaveBeat landing site, converted from plain static HTML to React 1:1 —
// same markup output, same CSS, same behaviour.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the site from /<repo>/, so production builds need that
  // prefix on every generated URL. Set SITE_BASE to override (e.g. '/' when
  // deploying to a domain root or to a host like Vercel/Netlify).
  base: process.env.SITE_BASE ?? (command === 'build' ? '/wavebeat-site/' : '/'),
  // react-bits Lanyard ships card.glb; ours lives in /public but keep the
  // include so a src-relative import would work too.
  assetsInclude: ['**/*.glb'],
}));
