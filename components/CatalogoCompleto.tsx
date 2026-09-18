"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIAS, GENEROS, productos } from "@/data/productos";
import FiltroTabs from "./FiltroTabs";
import TamanoSection from "./TamanoSection";
import {
  TAMANOS,
  TAMANO_LABEL,
  esTamano,
  filtrarPorTamano,
  type Tamano,
} from "@/lib/agrupacion";
import { aplicarFiltros, esCategoria, esGenero, esMarca } from "@/lib/filtros";

const TODOS = "Todos";

// Label visible ↔ valor del query param.
const TAMANO_POR_LABEL: Record<string, Tamano> = {
  [TAMANO_LABEL.grande]: "grande",
  [TAMANO_LABEL.chico]: "chico",
};

// /catalogo: todo el inventario con la jerarquía tamaño → marca.
//
// Todos los filtros viven en la URL, así los links de la Home llegan ya
// filtrados y el estado es compartible / sobrevive el reload:
//   ?tamano=grande|chico      (tabs)
//   ?categoria=<Categoria>    (tabs)
//   ?genero=<Genero>          (tabs)
//   ?marca=<Marca>            (solo por link, se limpia con un chip)
//   ?original=true            (solo por link, se limpia con un chip)
// Se usa router.replace (no push) para que cambiar de filtro no llene el
// historial: "atrás" sale del catálogo en vez de deshacer clicks de filtro.
export default function CatalogoCompleto({
  agotados = [],
}: {
  /**
   * Slugs sin stock. Llega como array (no Set/Map) porque cruza el borde
   * server -> client: lo calcula app/catalogo/page.tsx leyendo la base.
   */
  agotados?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const agotadosSet = useMemo(() => new Set(agotados), [agotados]);

  const paramTamano = searchParams.get("tamano");
  const tamanoActivo: Tamano | typeof TODOS = esTamano(paramTamano)
    ? paramTamano
    : TODOS;

  const paramCategoria = searchParams.get("categoria");
  const categoriaActiva = esCategoria(paramCategoria) ? paramCategoria : TODOS;

  const paramGenero = searchParams.get("genero");
  const generoActivo = esGenero(paramGenero) ? paramGenero : TODOS;

  const paramMarca = searchParams.get("marca");
  const marcaActiva = esMarca(paramMarca) ? paramMarca : undefined;

  const soloOriginales = searchParams.get("original") === "true";

  // Escribe/borra un query param preservando los demás.
  const setParam = (clave: string, valor?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtrados = useMemo(
    () =>
      aplicarFiltros(productos, {
        categoria: categoriaActiva === TODOS ? undefined : categoriaActiva,
        genero: generoActivo === TODOS ? undefined : generoActivo,
        marca: marcaActiva,
        soloOriginales,
      }),
    [categoriaActiva, generoActivo, marcaActiva, soloOriginales]
  );

  const tamanosVisibles = tamanoActivo === TODOS ? TAMANOS : [tamanoActivo];

  const hayResultados = tamanosVisibles.some(
    (t) => filtrarPorTamano(filtrados, t).length > 0
  );

  // Cambia con cualquier filtro para re-disparar el stagger de las tarjetas.
  const staggerKey = `${tamanoActivo}-${categoriaActiva}-${generoActivo}-${marcaActiva ?? ""}-${soloOriginales}`;

  return (
    <>
      {/* Continúa la banda azul-negro del encabezado de la página */}
      <section className="bg-azul-negro">
        <div className="mx-auto max-w-6xl space-y-5 px-5 pb-10">
          <div>
            <p className="label-ui mb-2 text-xs uppercase tracking-wide text-gris-azul">
              Tamaño
            </p>
            <FiltroTabs
              tabs={[TODOS, ...TAMANOS.map((t) => TAMANO_LABEL[t])]}
              activo={
                tamanoActivo === TODOS ? TODOS : TAMANO_LABEL[tamanoActivo]
              }
              onChange={(label) => setParam("tamano", TAMANO_POR_LABEL[label])}
            />
          </div>

          <div>
            <p className="label-ui mb-2 text-xs uppercase tracking-wide text-gris-azul">
              Categoría
            </p>
            <FiltroTabs
              tabs={[TODOS, ...CATEGORIAS]}
              activo={categoriaActiva}
              onChange={(c) => setParam("categoria", c === TODOS ? undefined : c)}
            />
          </div>

          <div>
            <p className="label-ui mb-2 text-xs uppercase tracking-wide text-gris-azul">
              Género
            </p>
            <FiltroTabs
              tabs={[TODOS, ...GENEROS]}
              activo={generoActivo}
              onChange={(g) => setParam("genero", g === TODOS ? undefined : g)}
            />
          </div>

          {/* Filtros que sólo llegan por link desde la Home: se muestran como
              chips para que se vean y se puedan quitar. */}
          {(marcaActiva || soloOriginales) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <p className="label-ui text-xs uppercase tracking-wide text-gris-azul">
                Filtros
              </p>
              {marcaActiva && (
                <button
                  type="button"
                  onClick={() => setParam("marca", undefined)}
                  className="chip-filtro"
                  aria-label={`Quitar filtro de marca ${marcaActiva}`}
                >
                  {marcaActiva} <span aria-hidden="true">✕</span>
                </button>
              )}
              {soloOriginales && (
                <button
                  type="button"
                  onClick={() => setParam("original", undefined)}
                  className="chip-filtro"
                  aria-label="Quitar filtro de originales"
                >
                  Solo originales <span aria-hidden="true">✕</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {hayResultados ? (
        tamanosVisibles.map((tamano) => (
          <TamanoSection
            key={tamano}
            tamano={tamano}
            productos={filtrados}
            staggerKey={staggerKey}
            agotados={agotadosSet}
          />
        ))
      ) : (
        <section className="bg-azul-med">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="text-gris-azul">
              No hay productos que coincidan con estos filtros.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
