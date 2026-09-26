import { useCallback, useEffect, useRef, useState } from 'react';

import Aurora from './Aurora.jsx';
import Lanyard from './Lanyard.jsx';
import { asset } from '../paths.js';

const SEEN_KEY = 'wavebeat:intro-seen';
const FADE_MS = 560;

function seenThisSession() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

// Full-screen intro: the site opens on the lanyard card, and dragging the card
// (or pressing Esc / "skip intro") fades the gate away and reveals the hero.
// Dismissal is remembered for the rest of the browser session.
export default function IntroGate() {
  const [phase, setPhase] = useState(() => (seenThisSession() ? 'gone' : 'in'));
  const [dragging, setDragging] = useState(false);
  const skipRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const reveal = useCallback(() => {
    if (phaseRef.current !== 'in') return;
    setPhase('out');
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode — intro just shows again next load */
    }
    window.setTimeout(() => setPhase('gone'), FADE_MS);
  }, []);

  // Esc skips, the site behind stays scroll-locked until the gate is gone.
  useEffect(() => {
    if (phase === 'gone') return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') reveal();
    };
    window.addEventListener('keydown', onKey);

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    skipRef.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', onKey);
      root.style.overflow = prevOverflow;
    };
  }, [phase, reveal]);

  if (phase === 'gone') return null;

  return (
    <div className="lanyard-gate" data-phase={phase} data-dragging={dragging} role="dialog" aria-label="WaveBeat intro">
      <Aurora id="aurora-intro" />
      <Lanyard
        position={[0, 0, 13]}
        gravity={[0, -40, 0]}
        frontImage={asset('lanyard/card-front.png')}
        backImage={asset('lanyard/card-back.png')}
        imageFit="cover"
        lanyardWidth={1.6}
        onRelease={reveal}
      />
      <div className="lanyard-gate__foot">
        <p className="lanyard-gate__hint">
          <strong>Drag the card</strong> to open WaveBeat
        </p>
        <button type="button" className="lanyard-gate__skip" ref={skipRef} onClick={reveal} onPointerDown={() => setDragging(true)} onPointerUp={() => setDragging(false)}>
          skip intro
        </button>
      </div>
    </div>
  );
}
