import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// WaveBeat landing site, converted from plain static HTML to React 1:1 —
// same markup output, same CSS, same behaviour.
export default defineConfig({
  plugins: [react()],
  // react-bits Lanyard ships card.glb; ours lives in /public but keep the
  // include so a src-relative import would work too.
  assetsInclude: ['**/*.glb'],
});