"use client";

import { useMemo, useState, useTransition } from "react";
import { cambiarDisponibilidad } from "@/app/admin/actions";
import { formatearPrecio } from "@/data/productos";
import type { ProductoConStock } from "@/lib/stock";
import ProductImage from "./ProductImage";

// Normaliza para buscar sin acentos ni mayúsculas (mismo criterio que el
// buscador del sitio).
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Lista de los 48 productos con un switch disponible/agotado por fila.
 *
 * El toggle escribe en la base con un server action y actualiza la fila en el
 * acto (estado local optimista), sin recargar la página. Si el guardado falla,
 * el switch vuelve atrás y aparece el error en esa misma fila.
 */
export default function PanelStock({ iniciales }: { iniciales: ProductoConStock[] }) {
  const [estados, setEstados] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(iniciales.map((p) => [p.slug, p.disponible])),
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState<Record<string, boolean>>({});
  const [consulta, setConsulta] = useState("");
  const [, startTransition] = useTransition();

  const termino = normalizar(consulta.trim());

  const visibles = useMemo(() => {
    if (!termino) return iniciales;
    return iniciales.filter(
      (p) =>
        normalizar(p.nombre).includes(termino) ||
        normalizar(p.marca).includes(termino) ||
        normalizar(p.slug).includes(termino),
    );
  }, [iniciales, termino]);

  const agotados = iniciales.filter((p) => estados[p.slug] === false).length;

  function alternar(slug: string) {
    const siguiente = !estados[slug];

    // Optimista: se ve el cambio ya, y se revierte si el server action falla.
    setEstados((prev) => ({ ...prev, [slug]: siguiente }));
    setErrores((prev) => {
      const { [slug]: _quitado, ...resto } = prev;
      return resto;
    });
    setGuardando((prev) => ({ ...prev, [slug]: true }));

    startTransition(async () => {
      const res = await cambiarDisponibilidad(slug, siguiente);
      setGuardando((prev) => ({ ...prev, [slug]: false }));

      if (!res.ok) {
        setEstados((prev) => ({ ...prev, [slug]: !siguiente }));
        setErrores((prev) => ({ ...prev, [slug]: res.error }));
        return;
      }
      setEstados((prev) => ({ ...prev, [slug]: res.disponible }));
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          inputMode="search"
          autoComplete="off"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Buscar por nombre, marca o slug…"
          aria-label="Buscar producto"
          className="buscador-input max-w-sm"
        />
        <p className="label-ui text-sm uppercase tracking-wide text-gris-azul">
          {agotados === 0
            ? `${iniciales.length} productos · todos disponibles`
            : `${agotados} agotado${agotados === 1 ? "" : "s"} de ${iniciales.length}`}
        </p>
      </div>

      {visibles.length === 0 ? (
        <p className="mt-8 text-gris-azul">
          No encontramos productos para “{consulta.trim()}”.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {visibles.map((producto) => {
            const disponible = estados[producto.slug];
            return (
              <li
                key={producto.slug}
                className="tarjeta flex items-center gap-4 p-3 sm:p-4"
              >
                <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--tarjeta-borde)]">
                  <ProductImage
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    sizes="48px"
                    className={`object-cover ${disponible ? "" : "opacity-40"}`}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-cinzel text-base text-blanco">
                    {producto.nombre}
                  </span>
                  <span className="label-ui block text-[11px] uppercase tracking-wide text-gris-azul">
                    {producto.marca} · {producto.mililitros} ml ·{" "}
                    {formatearPrecio(producto.precio)}
                  </span>
                  {errores[producto.slug] && (
                    <span role="alert" className="block text-sm text-blanco">
                      {errores[producto.slug]}
                    </span>
                  )}
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-checked={disponible}
                  aria-label={`${producto.nombre}: ${disponible ? "disponible" : "agotado"}`}
                  onClick={() => alternar(producto.slug)}
                  disabled={guardando[producto.slug]}
                  className="switch-stock shrink-0"
                  data-activo={disponible}
                >
                  <span className="switch-stock__pista" aria-hidden="true">
                    <span className="switch-stock__perilla" />
                  </span>
                  <span className="label-ui switch-stock__texto">
                    {disponible ? "Disponible" : "Agotado"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
