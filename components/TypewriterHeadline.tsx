"use client";

import { useEffect, useRef, useState } from "react";

// Anima el headline del hero letra por letra, una sola vez al cargar la página.
// Respeta prefers-reduced-motion: reduce (muestra el texto completo, sin cursor).
export default function TypewriterHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "done" | "clean">("typing");
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedRef.current) {
      setCount(text.length);
      setPhase("clean");
      return;
    }

    const total = 1400; // ms — techo de duración
    const step = Math.max(20, Math.floor(total / text.length));
    let i = 0;
    const interval = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        window.clearInterval(interval);
        setPhase("done");
        window.setTimeout(() => setPhase("clean"), 2400);
      }
    }, step);

    return () => window.clearInterval(interval);
  }, [text]);

  const shown = reducedRef.current ? text : text.slice(0, count);

  return (
    <h1 className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      {phase !== "clean" && (
        <span
          aria-hidden="true"
          className={`tw-caret ${phase === "done" ? "tw-caret--done" : ""}`}
        />
      )}
    </h1>
  );
}
