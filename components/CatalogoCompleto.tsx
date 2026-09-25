"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIAS, GENEROS } from "@/data/productos";
import { productosParaModo, type Modo } from "@/lib/catalogo";
import FiltroTabs from "./FiltroTabs";
import FabricanteSection from "./FabricanteSection";
import {
  TAMANOS,
  TAMANO_DETALLE,
  TAMANO_LABEL,
  fabricantesConProductos,
  type Tamano,
} from "@/lib/agrupacion";
import {
  PARAM_CASA_ORIGINAL,
  VALOR_CASA_ORIGINAL,
  aplicarFiltros,
  esCategoria,
  esFabricante,
  esGenero,
  esMarca,
  esTamano,
} from "@/lib/filtros";

const TODOS = "Todos";

// Label visible ↔ valor del query param.
const TAMANO_POR_LABEL: Record<string, Tamano> = {
  [TAMANO_LABEL.grande]: "grande",
  [TAMANO_LABEL.chico]: "chico",
};

// /catalogo: todo el inventario con la jerarquía fabricante → línea.
//
// Todos los filtros viven en la URL, así los links de la Home llegan ya
// filtrados y el estado es compartible / sobrevive el reload:
//   ?tamano=grande|chico      (tabs)
//   ?categoria=<Categoria>    (tabs)
//   ?genero=<Genero>          (tabs)
//   ?fabricante=<Fabricante>  (solo por link, se limpia con un chip)
//   ?marca=<Marca>            (solo por link, se limpia con un chip)
//   ?casaoriginal=1           (solo por link, se limpia con un chip; es
//                             "casa original", NO el modo del catálogo)
//   ?modo=g5|original         (modo del catálogo; lo resuelve la página y
//                             llega como prop. setParam lo conserva al
//                             cambiar de filtro)
// Se usa router.replace (no push) para que cambiar de filtro no llene el
// historial: "atrás" sale del catálogo en vez de deshacer clicks de filtro.
export default function CatalogoCompleto({
  modo,
  agotados = [],
}: {
  /**
   * Modo del catálogo, resuelto por la página en el server (lee `?modo=`).
   * Viene como prop y no del ModoCatalogoContext para que el HTML del server
   * ya salga con los productos y precios del modo correcto.
   */
  modo: Modo;
  /**
   * Slugs sin stock EN ESE MODO. Llega como array (no Set/Map) porque cruza el
   * borde server -> client: lo calcula app/catalogo/page.tsx leyendo la base.
   */
  agotados?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const agotadosSet = useMemo(() => new Set(agotados), [agotados]);

  // Productos del modo activo (lista cacheada: referencia estable por modo).
  const productos = productosParaModo(modo);

  const paramTamano = searchParams.get("tamano");
  const tamanoActivo: Tamano | typeof TODOS = esTamano(paramTamano)
    ? paramTamano
    : TODOS;

  const paramCategoria = searchParams.get("categoria");
  const categoriaActiva = esCategoria(paramCategoria) ? paramCategoria : TODOS;

  const paramGenero = searchParams.get("genero");
  const generoActivo = esGenero(paramGenero) ? paramGenero : TODOS;

  const paramFabricante = searchParams.get("fabricante");
  const fabricanteActivo = esFabricante(paramFabricante)
    ? paramFabricante
    : undefined;

  const paramMarca = searchParams.get("marca");
  const marcaActiva = esMarca(paramMarca) ? paramMarca : undefined;

  // `?casaoriginal=1` = solo fragancias de casa original (`esCasaOriginal`). NO
  // es el modo del catálogo (ese va en `?modo=`). Antes era `?original=true`;
  // se renombró para que no se confunda con `?modo=original`.
  const soloCasasOriginales =
    searchParams.get(PARAM_CASA_ORIGINAL) === VALOR_CASA_ORIGINAL;

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
        fabricante: fabricanteActivo,
        categoria: categoriaActiva === TODOS ? undefined : categoriaActiva,
        genero: generoActivo === TODOS ? undefined : generoActivo,
        tamano: tamanoActivo === TODOS ? undefined : tamanoActivo,
        marca: marcaActiva,
        soloCasasOriginales,
      }),
    [
      productos,
      fabricanteActivo,
      categoriaActiva,
      generoActivo,
      tamanoActivo,
      marcaActiva,
      soloCasasOriginales,
    ]
  );

  const fabricantesVisibles = fabricantesConProductos(filtrados);

  // Cambia con cualquier filtro para re-disparar el stagger de las tarjetas.
  const staggerKey = `${tamanoActivo}-${categoriaActiva}-${generoActivo}-${fabricanteActivo ?? ""}-${marcaActiva ?? ""}-${soloCasasOriginales}`;

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
            {tamanoActivo !== TODOS && (
              <p className="mt-2 text-sm text-gris-azul">
                {TAMANO_DETALLE[tamanoActivo]}
              </p>
            )}
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
          {(fabricanteActivo || marcaActiva || soloCasasOriginales) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <p className="label-ui text-xs uppercase tracking-wide text-gris-azul">
                Filtros
              </p>
              {fabricanteActivo && (
                <button
                  type="button"
                  onClick={() => setParam("fabricante", undefined)}
                  className="chip-filtro"
                  aria-label={`Quitar filtro de fabricante ${fabricanteActivo}`}
                >
                  {fabricanteActivo} <span aria-hidden="true">✕</span>
                </button>
              )}
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
              {soloCasasOriginales && (
                <button
                  type="button"
                  onClick={() => setParam(PARAM_CASA_ORIGINAL, undefined)}
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

      {fabricantesVisibles.length > 0 ? (
        fabricantesVisibles.map((fabricante) => (
          <FabricanteSection
            key={fabricante}
            fabricante={fabricante}
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
