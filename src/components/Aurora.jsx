import { useEffect, useRef } from 'react';

// react-bits Aurora, ported to vanilla WebGL2 — exactly the pipeline the static
// site ran: the canvas and the shaders live in index.html, this component
// compiles them, draws the fullscreen triangle, and marks the page as
// "aurora-live" so the CSS blooms step aside.
//
// Pass `id` to run the same shader on a canvas this component renders itself
// (used by the lanyard intro, which needs its own sky above the site).
export default function Aurora({ id = null }) {
  const ownRef = useRef(null);

  useEffect(() => {
    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = id ? ownRef.current : document.getElementById('aurora');
    if (!canvas || !window.WebGL2RenderingContext) return undefined;

    // Params from the react-bits usage the site picked.
    const AURORA = {
      colorStops: ['#7cff67', '#B497CF', '#5227FF'],
      blend: 0.5,
      amplitude: 1.0,
      speed: 1.0,
      lightMode: false
    };

    let gl;
    try {
      gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
    } catch (e) { return undefined; }
    if (!gl) return undefined;

    function hexToRgb(hx) {
      let h = hx.replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255
      ];
    }

    // Strip the leading newline that textContent picks up from the script tag —
    // ANGLE wants #version on the very first line.
    const vsSrc = document.getElementById('aurora-vs').textContent.replace(/^\s+/, '');
    const fsSrc = document.getElementById('aurora-fs').textContent.replace(/^\s+/, '');

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error('Aurora: ' + gl.getShaderInfoLog(s));
      }
      return s;
    }

    let program;
    try {
      const vs = compile(gl.VERTEX_SHADER, vsSrc);
      const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Aurora link: ' + gl.getProgramInfoLog(program));
      }
    } catch (e) {
      if (window.console && console.warn) console.warn(e.message);
      return undefined;
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const U = {
      time: gl.getUniformLocation(program, 'uTime'),
      amplitude: gl.getUniformLocation(program, 'uAmplitude'),
      stops: gl.getUniformLocation(program, 'uColorStops'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      blend: gl.getUniformLocation(program, 'uBlend'),
      lightMode: gl.getUniformLocation(program, 'uLightMode')
    };

    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let stopVals = [];
    AURORA.colorStops.forEach((c) => { stopVals = stopVals.concat(hexToRgb(c)); });
    gl.uniform3fv(U.stops, stopVals);
    gl.uniform1f(U.blend, AURORA.blend);
    gl.uniform1f(U.amplitude, AURORA.amplitude);
    gl.uniform1f(U.lightMode, AURORA.lightMode ? 1 : 0);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(window.innerWidth * dpr));
      const h = Math.max(1, Math.round(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);        // full-buffer viewport — without this the
        gl.uniform2f(U.resolution, w, h); // triangle only drew into the 300×150 default
      }
    }
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    let raf = 0;
    let fadeStart = null;

    function render(now) {
      gl.uniform1f(U.time, (now / 1000) * AURORA.speed);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduceMQ.matches) {
        if (fadeStart === null) fadeStart = now;
        const p = Math.min(1, (now - fadeStart) / 560);
        canvas.style.opacity = String(p);
      }
    }

    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;      // no work while the tab is away
      render(now);
    }

    function setMotion() {
      const reduce = reduceMQ.matches;
      if (reduce) {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        canvas.style.opacity = '1';      // one still frame, no movement
        render(0);
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    }

    if (reduceMQ.addEventListener) {
      reduceMQ.addEventListener('change', setMotion);
    } else {
      reduceMQ.addListener(setMotion);
    }

    resize();
    if (!id) document.documentElement.classList.add('aurora-live');
    setMotion();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('orientationchange', resize);
      if (reduceMQ.removeEventListener) {
        reduceMQ.removeEventListener('change', setMotion);
      } else {
        reduceMQ.removeListener(setMotion);
      }
    };
  }, [id]);

  if (id) {
    return <canvas id={id} ref={ownRef} className="lanyard-gate__sky" role="presentation" aria-hidden="true" />;
  }
  return null;
}