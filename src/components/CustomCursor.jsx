import React, { useEffect, useRef } from "react";

/**
 * Double-ring cursor: the inner dot tracks the pointer exactly, the outer ring
 * trails it with a lerp. The ring opens up over anything clickable.
 */
export default function CustomCursor() {
  const innerRef = useRef(null);
  const outerRef = useRef(null);

  useEffect(() => {
    // Touch and pen users never see a cursor, so don't run any of this for them.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    document.body.classList.add("has-custom-cursor");

    const inner = innerRef.current;
    const outer = outerRef.current;

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let outerX = cursorX;
    let outerY = cursorY;

    const onMouseMove = (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (inner) {
        inner.style.left = `${cursorX}px`;
        inner.style.top = `${cursorY}px`;
      }

      const overInteractive = event.target?.closest?.(
        "a, button, input, select, textarea, [role='button']"
      );
      if (outer) outer.classList.toggle("is-hovering", Boolean(overInteractive));
    };

    window.addEventListener("mousemove", onMouseMove);

    let frame;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      outerX += (cursorX - outerX) * 0.2;
      outerY += (cursorY - outerY) * 0.2;
      if (outer) {
        outer.style.left = `${outerX}px`;
        outer.style.top = `${outerY}px`;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div ref={innerRef} className="cursor-inner" aria-hidden="true" />
      <div ref={outerRef} className="cursor-outer" aria-hidden="true" />
    </>
  );
}
