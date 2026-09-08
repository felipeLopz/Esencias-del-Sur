"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Barra de tabs con indicador (pill blanco) que se desliza al tab activo.
// Extraído de CatalogoFiltrable para poder reusar el mismo estilo/animación
// en más de un lugar. Presentacional: el estado del filtro vive en el padre.
export default function FiltroTabs({
  tabs,
  activo,
  onChange,
}: {
  tabs: string[];
  activo: string;
  onChange: (tab: string) => void;
}) {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const medirIndicador = () => {
    const el = btnRefs.current[activo];
    if (!el) return;
    setInd({
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  };

  useLayoutEffect(medirIndicador, [activo]);

  useEffect(() => {
    window.addEventListener("resize", medirIndicador);
    return () => window.removeEventListener("resize", medirIndicador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);

  return (
    <div className="relative inline-flex flex-wrap gap-3">
      <span
        aria-hidden="true"
        className="tab-indicator"
        style={
          ind
            ? {
                transform: `translate(${ind.left}px, ${ind.top}px)`,
                width: ind.width,
                height: ind.height,
              }
            : { opacity: 0 }
        }
      />
      {tabs.map((tab) => {
        const esActivo = tab === activo;
        return (
          <button
            key={tab}
            ref={(el) => {
              btnRefs.current[tab] = el;
            }}
            onClick={() => onChange(tab)}
            className={`btn-pill label-ui relative z-10 px-5 py-2 text-sm transition-colors duration-200 ${
              esActivo ? "text-azul-negro" : "text-blanco"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
