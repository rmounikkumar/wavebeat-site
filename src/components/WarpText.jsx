import { Fragment, useMemo } from 'react';

// react-bits WarpText ported to CSS (same as the static site): characters ride
// a sine wave with a red/mint chromatic fringe on hover. Fine pointers only;
// reduced motion renders plain text with no split spans — exactly like the
// original script produced. Pass `text` for a single line, or `lines` (array)
// for multi-line headings — each line keeps its break, one continuous wave.
export default function WarpText({ text, lines }) {
  const reduced = useMemo(
    () => (typeof window !== 'undefined') && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const sourceLines = lines || (text !== undefined ? [text] : []);

  if (reduced) {
    return (
      <span className="warp" data-warp>
        {sourceLines.map((line, li) => (
          <Fragment key={li}>
            {line}
            {li < sourceLines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </span>
    );
  }

  let charIndex = 0;
  const count = sourceLines.join(' ').replace(/\s/g, '').length;   // total characters → --count

  return (
    <span className="warp" data-warp style={{ '--count': count }}>
      {sourceLines.map((line, li) => {
        const words = line.split(' ');
        return (
          <Fragment key={li}>
            {words.map((word, wi) => (
              <Fragment key={wi}>
                <span className="wt-word">
                  {Array.from(word).map((ch) => (
                    <span key={charIndex} className="wt-ch" style={{ '--i': charIndex++ }}>{ch}</span>
                  ))}
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
            {li < sourceLines.length - 1 ? <br /> : null}
          </Fragment>
        );
      })}
    </span>
  );
}