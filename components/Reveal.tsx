"use client";

import { useEffect, useRef, useState } from "react";

// Revela su contenido con fade + translateY leve la primera vez que entra al
// viewport (IntersectionObserver). No se repite. Respeta prefers-reduced-motion.
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    // `rootMargin` positivo agranda el viewport "virtual" hacia abajo: la
    // sección se marca visible ANTES de entrar en pantalla de verdad, no
    // recién cuando el 12% ya se ve. Sin este margen, en mobile (donde cada
    // sección de marca ocupa casi toda la altura de pantalla al ser una sola
    // columna) un flick rápido aterriza al usuario justo sobre una sección
    // que recién ahora dispara el observer: la transición de 0.5s todavía no
    // arrancó y se ve una banda en blanco/opacity:0 hasta que termina. En
    // desktop el scroll suele ser más gradual y da tiempo a que la
    // transición termine antes de que la sección quede centrada en pantalla,
    // por eso ahí no se nota. Con el margen, el observer dispara con
    // anticipación fija (en píxeles de scroll, no en tiempo), así que da lo
    // mismo qué tan rápido se llegue.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px 400px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
