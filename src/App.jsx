import { lazy, Suspense, useCallback, useEffect, useState } from 'react';

import Aurora from './components/Aurora.jsx';
import WarpText from './components/WarpText.jsx';
import './components/IntroGate.css';
import { DL, NAV_LINKS, PANELS, DIFF_ROWS, FEATURE_ROWS, INSTALL_ROWS } from './data.jsx';

// The lanyard intro pulls in three.js + rapier (~1 MB gzipped), so it loads as
// its own chunk — and only for visitors who haven't dismissed the intro yet.
const IntroGate = lazy(() => import('./components/IntroGate.jsx'));

function introSeen() {
  try {
    return window.sessionStorage.getItem('wavebeat:intro-seen') === '1';
  } catch {
    return false;
  }
}

// One workbench panel — same markup as the original page.
function Panel({ no, name, img, alt, caption, detail, anno, eager, first, flip }) {
  const cls = ['panel'];
  if (flip) cls.push('panel--flip');
  if (first) cls.push('in-view');

  return (
    <div className={cls.join(' ')}>
      <figure className="panel__media">
        <div className="screenshot">
          <span className="screenshot__tag">{no} · {name}</span>
          <img src={img} alt={alt} width="1080" height="2400" loading={eager ? 'eager' : 'lazy'} />
        </div>
      </figure>
      <div className="panel__notes">
        <p className="panel__no">{no} — {name}</p>
        <h2 className="panel__caption"><span>{caption}</span></h2>
        <p className="panel__detail">{detail}</p>
        <p className="panel__anno">{anno}</p>
      </div>
    </div>
  );
}

export default function App() {
  // The intro covers the page with an opaque screen, so the page's own aurora
  // would be a full-screen shader drawing nothing you can see — and on a phone
  // that is real frame time. It starts when the intro reveals instead.
  const [needsIntro] = useState(() => !introSeen());
  const [auroraOn, setAuroraOn] = useState(() => introSeen());
  const startAurora = useCallback(() => setAuroraOn(true), []);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Entrance — let the first paint settle, then hero + nav rise in.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add('hero-ready'));
    });

    // Reveals — panels and section heads enter as they cross the viewport.
    const reveals = document.querySelectorAll('.panel, [data-reveal]');
    let io = null;
    if ('IntersectionObserver' in window && !reduce) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
        });
      }, { threshold: 0.2 });
      reveals.forEach((r) => io.observe(r));
    } else {
      reveals.forEach((r) => r.classList.add('in-view'));
    }

    // Sticky download bar — turns on once the hero is scrolled past, stays on.
    const cta = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');
    let stickyFired = false;
    let fo = null;

    const maybeShow = () => {
      if (stickyFired) return;
      if (window.scrollY >= hero.offsetTop + hero.offsetHeight) {
        stickyFired = true;
        cta.classList.add('sticky-cta--on');
        window.removeEventListener('scroll', maybeShow);
      }
    };

    if (cta && hero) {
      window.addEventListener('scroll', maybeShow, { passive: true });
      maybeShow();

      // ...and steps out of the way when the footer is on screen.
      if ('IntersectionObserver' in window) {
        const foot = document.querySelector('.foot-stmt');
        if (foot) {
          fo = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              cta.classList.toggle('sticky-cta--off', e.isIntersecting);
            });
          }, { threshold: 0 });
          fo.observe(foot);
        }
      }
    }

    return () => {
      window.removeEventListener('scroll', maybeShow);
      if (io) io.disconnect();
      if (fo) fo.disconnect();
    };
  }, []);

  return (
    <>
      {needsIntro && (
        <Suspense
          fallback={
            <div className="lanyard-gate lanyard-gate--loading">
              <p className="lanyard-gate__hint">Loading WaveBeat…</p>
            </div>
          }
        >
          <IntroGate onReveal={startAurora} />
        </Suspense>
      )}

      {auroraOn && <Aurora />}

      <a className="skip-link" href="#main">Skip to content</a>

      <nav className="nav-pill" aria-label="Primary">
        <a className="wordmark" href="#" aria-label="WaveBeat — back to top">WaveBeat</a>
        <ul className="nav-pill__links">
          {NAV_LINKS.map((l) => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <a className="btn btn--primary" href={DL} download>Get the app</a>
      </nav>

      <header className="hero">
        <div className="hero__inner">
          <p className="eyebrow">WaveBeat · v1.0.15</p>
          <h1><WarpText lines={['Plays the files on your phone.', 'Shows the words, too.']} /></h1>
          <p className="leder-sub">
            A no-account music player for the songs already on your device. Long-press any
            song to play it next, add it to a playlist, favorite it, or delete it — and
            synced lyrics scroll along as it plays.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href={DL} download>Get WaveBeat</a>
            <a className="btn btn--ghost" href="#install">How to install</a>
          </div>
          <div className="hero__meta" aria-label="Release details">
            <span>APK · 8.1 MB</span><span>Android 8.0+</span><span>Free · no ads</span><span>no accounts</span>
          </div>
          <p className="hero__hint">First install, your phone asks to “allow unknown sources” — that’s normal for a direct APK download.</p>
        </div>
      </header>

      <main id="main">

        <section className="workbench" id="the-app" aria-label="The app">
          {PANELS.map((p) => (
            <Panel key={p.no} {...p} />
          ))}
        </section>

        <section className="diff" aria-label="Why WaveBeat is different from other music apps">
          <div className="ledger__head" data-reveal="">
            <h2 className="leder-head"><WarpText text="Not another player app." /></h2>
            <p className="leder-sub">Open most music apps and you're looking at a store with a player attached. WaveBeat runs the other way: no catalog to stream, no login, no feed of things to buy — just the songs on your phone, played properly.</p>
          </div>
          <div className="diff__rows">
            {DIFF_ROWS.map((row, i) => (
              <div className="diff__row" key={i}>
                <p className="diff__them">{row.them}</p>
                <p className="diff__us">{row.us}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ledger" id="features" aria-label="Features">
          <div className="ledger__head" data-reveal="">
            <h2 className="leder-head">A player, not a store.</h2>
            <p className="leder-sub">No subscriptions, no playlists full of songs you don't own. Just the buttons a music player should have, pointed at your own files.</p>
          </div>
          <div className="ledger__rows">
            {FEATURE_ROWS.map((row) => (
              <div className="ledger__row" key={row.no}>
                <span className="row-no">{row.no}</span>
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ledger" id="install" aria-label="Install">
          <div className="ledger__head" data-reveal="">
            <h2 className="leder-head">Running in about a minute.</h2>
            <p className="leder-sub">WaveBeat isn't on the Play Store — you grab the APK here and install it directly. Three steps, once.</p>
          </div>
          <div className="ledger__rows">
            {INSTALL_ROWS.map((row) => (
              <div className="ledger__row" key={row.no}>
                <span className="row-no">{row.no}</span>
                <div>
                  <h3>{row.title}</h3>
                  {row.body}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <aside className="sticky-cta" aria-label="Download WaveBeat">
        <div className="sticky-cta__meta">
          <b>WaveBeat 1.0.15</b>
          <span>APK · 8.1 MB · Android 8.0+</span>
        </div>
        <a className="btn btn--primary" href={DL} download>Get WaveBeat →</a>
      </aside>

      <footer className="foot-stmt">
        <p className="foot-stmt__line" data-reveal="">Made for the music you already own.</p>
        <div className="foot-stmt__meta">
          <span>WaveBeat</span>
          <span>© 2026 · <a href="https://github.com/rmounikkumar/wavebeat-with-lyrics">github.com/rmounikkumar/wavebeat-with-lyrics</a> · Free · Android · APK on GitHub</span>
        </div>
      </footer>
    </>
  );
}