"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CATEGORIAS, type Producto } from "@/data/productos";
import ProductCard from "./ProductCard";

type Filtro = "Todos" | (typeof CATEGORIAS)[number];

export default function CatalogoFiltrable({
  productos,
}: {
  productos: Producto[];
}) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const tabs: Filtro[] = ["Todos", ...CATEGORIAS];

  const visibles = useMemo(
    () =>
      filtro === "Todos"
        ? productos
        : productos.filter((p) => p.categoria === filtro),
    [filtro, productos]
  );

  // --- Indicador deslizante de los tabs (animación #5) ---
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ind, setInd] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const medirIndicador = () => {
    const el = btnRefs.current[filtro];
    if (!el) return;
    setInd({
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  };

  useLayoutEffect(medirIndicador, [filtro]);

  useEffect(() => {
    window.addEventListener("resize", medirIndicador);
    return () => window.removeEventListener("resize", medirIndicador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  return (
    <div>
      <div className="relative mb-8 inline-flex flex-wrap gap-3">
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
          const activo = tab === filtro;
          return (
            <button
              key={tab}
              ref={(el) => {
                btnRefs.current[tab] = el;
              }}
              onClick={() => setFiltro(tab)}
              className={`btn-pill label-ui relative z-10 px-5 py-2 text-sm transition-colors duration-200 ${
                activo ? "text-azul-negro" : "text-blanco"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <p className="text-gris-azul">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((producto, i) => (
            <div
              key={`${filtro}-${producto.id}`}
              className="card-stagger"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
