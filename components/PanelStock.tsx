"use client";

import { useMemo, useState, useTransition } from "react";
import { cambiarDisponibilidad } from "@/app/admin/actions";
import { formatearPrecio } from "@/data/productos";
import { MODOS, MODO_CORTO, type Modo } from "@/lib/catalogo";
import type { ProductoConStock } from "@/lib/stock";
import ProductImage from "./ProductImage";

// Estado de stock por modo y por producto: "g5:eclaire", "original:eclaire".
const clave = (modo: Modo, slug: string) => `${modo}:${slug}`;

// Normaliza para buscar sin acentos ni mayúsculas (mismo criterio que el
// buscador del sitio).
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Lista de los 48 productos con dos switches disponible/agotado por fila: uno
 * por modo (G5 y Original), porque el stock es independiente en cada uno.
 *
 * El toggle escribe en la base con un server action y actualiza la fila en el
 * acto (estado local optimista), sin recargar la página. Si el guardado falla,
 * el switch vuelve atrás y aparece el error en esa misma fila.
 */
export default function PanelStock({
  iniciales,
  inicialesOriginal,
}: {
  /** Los productos con su stock G5 (`disponible`). */
  iniciales: ProductoConStock[];
  /** Stock Original por slug (sin dato en la base = disponible). */
  inicialesOriginal: Record<string, boolean>;
}) {
  const [estados, setEstados] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      iniciales.flatMap((p) => [
        [clave("g5", p.slug), p.disponible],
        [clave("original", p.slug), inicialesOriginal[p.slug] ?? true],
      ]),
    ),
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

  const agotadosEn = (modo: Modo) =>
    iniciales.filter((p) => estados[clave(modo, p.slug)] === false).length;
  const agotados = agotadosEn("g5");
  const agotadosOriginal = agotadosEn("original");

  function alternar(slug: string, modo: Modo) {
    const k = clave(modo, slug);
    const siguiente = !estados[k];

    // Optimista: se ve el cambio ya, y se revierte si el server action falla.
    setEstados((prev) => ({ ...prev, [k]: siguiente }));
    setErrores((prev) => {
      const { [slug]: _quitado, ...resto } = prev;
      return resto;
    });
    setGuardando((prev) => ({ ...prev, [k]: true }));

    startTransition(async () => {
      const res = await cambiarDisponibilidad(slug, siguiente, modo);
      setGuardando((prev) => ({ ...prev, [k]: false }));

      if (!res.ok) {
        setEstados((prev) => ({ ...prev, [k]: !siguiente }));
        setErrores((prev) => ({
          ...prev,
          [slug]: `${MODO_CORTO[modo]}: ${res.error}`,
        }));
        return;
      }
      setEstados((prev) => ({ ...prev, [k]: res.disponible }));
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
          {agotadosOriginal > 0 &&
            ` · ${agotadosOriginal} agotado${agotadosOriginal === 1 ? "" : "s"} en Original`}
        </p>
      </div>

      {visibles.length === 0 ? (
        <p className="mt-8 text-gris-azul">
          No encontramos productos para “{consulta.trim()}”.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {visibles.map((producto) => {
            // La foto se atenúa solo si está agotado en G5 (lo de siempre).
            const disponible = estados[clave("g5", producto.slug)];
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
                    {producto.marca} · {producto.mililitros} ml · G5{" "}
                    {formatearPrecio(producto.precios.g5)} · Original{" "}
                    {producto.precios.original !== undefined
                      ? formatearPrecio(producto.precios.original)
                      : "sin precio"}
                  </span>
                  {errores[producto.slug] && (
                    <span role="alert" className="block text-sm text-blanco">
                      {errores[producto.slug]}
                    </span>
                  )}
                </span>

                {/* Un switch por modo, cada uno con su etiqueta a la izquierda. */}
                <span className="flex shrink-0 flex-col items-end gap-2">
                  {MODOS.map((modo) => {
                    const k = clave(modo, producto.slug);
                    const activo = estados[k];
                    return (
                      <span key={modo} className="flex items-center gap-3">
                        <span className="label-ui w-16 text-right text-[11px] uppercase tracking-wide text-gris-azul">
                          {MODO_CORTO[modo]}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={activo}
                          aria-label={`${producto.nombre} (${MODO_CORTO[modo]}): ${activo ? "disponible" : "agotado"}`}
                          onClick={() => alternar(producto.slug, modo)}
                          disabled={guardando[k]}
                          className="switch-stock shrink-0"
                          data-activo={activo}
                        >
                          <span className="switch-stock__pista" aria-hidden="true">
                            <span className="switch-stock__perilla" />
                          </span>
                          <span className="label-ui switch-stock__texto">
                            {activo ? "Disponible" : "Agotado"}
                          </span>
                        </button>
                      </span>
                    );
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
