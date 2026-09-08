"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIAS, productos } from "@/data/productos";
import FiltroTabs from "./FiltroTabs";
import TamanoSection from "./TamanoSection";
import {
  TAMANOS,
  TAMANO_LABEL,
  esTamano,
  filtrarPorTamano,
  type Tamano,
} from "@/lib/agrupacion";

type FiltroCategoria = "Todos" | (typeof CATEGORIAS)[number];

const TODOS = "Todos";

// Label visible ↔ valor del query param.
const TAMANO_POR_LABEL: Record<string, Tamano> = {
  [TAMANO_LABEL.grande]: "grande",
  [TAMANO_LABEL.chico]: "chico",
};

// /catalogo: todo el inventario con la jerarquía tamaño → marca.
// - Tamaño: fuente de verdad en la URL (?tamano=grande|chico), así el link de
//   la Home llega ya filtrado y el estado es compartible / sobrevive el reload.
//   Se usa router.replace (no push) para que cambiar de filtro no llene el
//   historial: "atrás" sale del catálogo en vez de deshacer clicks de filtro.
// - Categoría: estado local, mismo comportamiento transversal de antes.
export default function CatalogoCompleto() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramTamano = searchParams.get("tamano");
  const tamanoActivo: Tamano | typeof TODOS = esTamano(paramTamano)
    ? paramTamano
    : TODOS;

  const [categoria, setCategoria] = useState<FiltroCategoria>(TODOS);

  const cambiarTamano = (label: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const valor = TAMANO_POR_LABEL[label];
    if (valor) {
      params.set("tamano", valor);
    } else {
      params.delete("tamano");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filtrados = useMemo(
    () =>
      categoria === TODOS
        ? productos
        : productos.filter((p) => p.categoria === categoria),
    [categoria]
  );

  const tamanosVisibles = tamanoActivo === TODOS ? TAMANOS : [tamanoActivo];

  const hayResultados = tamanosVisibles.some(
    (t) => filtrarPorTamano(filtrados, t).length > 0
  );

  // Cambia con cualquiera de los dos filtros para re-disparar el stagger.
  const staggerKey = `${tamanoActivo}-${categoria}`;

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
              onChange={cambiarTamano}
            />
          </div>

          <div>
            <p className="label-ui mb-2 text-xs uppercase tracking-wide text-gris-azul">
              Categoría
            </p>
            <FiltroTabs
              tabs={[TODOS, ...CATEGORIAS]}
              activo={categoria}
              onChange={(t) => setCategoria(t as FiltroCategoria)}
            />
          </div>
        </div>
      </section>

      {hayResultados ? (
        tamanosVisibles.map((tamano) => (
          <TamanoSection
            key={tamano}
            tamano={tamano}
            productos={filtrados}
            staggerKey={staggerKey}
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
