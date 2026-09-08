"use client";

import { useRef, useState } from "react";

// PLACEHOLDER — botón "Consultar" de tarjeta / detalle de producto.
// No dispara ninguna acción real todavía (href="#"): al hacer click solo muestra
// un check ~1s como feedback visual y vuelve al estado normal.
export default function ConsultarButton({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [ok, setOk] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setOk(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setOk(false), 1000);
      }}
      aria-label={ok ? "Consulta registrada" : undefined}
      className={className}
    >
      {ok ? (
        <span className="check-pop" aria-hidden="true">
          ✓
        </span>
      ) : (
        children
      )}
    </a>
  );
}
