import React, { useEffect, useRef } from "react";

/**
 * Fixed editorial grid: one hairline under the header and five vertical rules
 * carrying dots that drift as the page scrolls.
 */
export default function GridLines() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const dots = Array.from(root.querySelectorAll(".grid-dot"));
    let frame;
    let currentScroll = 0;

    const tick = () => {
      frame = requestAnimationFrame(tick);

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      currentScroll += (targetScroll - currentScroll) * 0.06;

      dots.forEach((dot, i) => {
        const startY = ((i * 17) % 80) + 10;
        let speed = 90 + ((i * 55) % 180);
        if (i % 2 === 0) speed = -speed;
        let y = startY + currentScroll * speed;
        y = ((y % 100) + 100) % 100;
        dot.style.top = `${y}%`;
      });
    };
    tick();

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true">
      <div className="grid-horizontal-line" />
      <div className="grid-lines">
        {[0, 1, 2, 3, 4].map((i) => (
          <div className="grid-line" key={i}>
            <div className="grid-dot" />
            <div className="grid-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}
