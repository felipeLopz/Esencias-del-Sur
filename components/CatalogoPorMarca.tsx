"use client";

import { useMemo, useState } from "react";
import { CATEGORIAS, MARCAS, productos } from "@/data/productos";
import FiltroTabs from "./FiltroTabs";
import MarcaSection, { FONDO_MARCA } from "./MarcaSection";

type Filtro = "Todos" | (typeof CATEGORIAS)[number];

// /catalogo: organización principal por marca (mismo orden y grupos por formato
// que la Home). El filtro por categoría de CatalogoFiltrable se conserva como
// filtro secundario transversal: acota qué productos se muestran dentro de cada
// sección de marca, reusando FiltroTabs (indicador deslizante) y el stagger.
export default function CatalogoPorMarca() {
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const tabs: string[] = ["Todos", ...CATEGORIAS];

  const filtrados = useMemo(
    () =>
      filtro === "Todos"
        ? productos
        : productos.filter((p) => p.categoria === filtro),
    [filtro]
  );

  // Marcas con al menos un producto tras el filtro — se calcula antes de
  // renderizar para mantener el alternado de fondos limpio.
  const marcasVisibles = useMemo(
    () => MARCAS.filter((m) => filtrados.some((p) => p.marca === m)),
    [filtrados]
  );

  return (
    <>
      <section className="bg-azul-negro">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-10">
          <h1 className="font-cinzel text-4xl text-blanco">Catálogo completo</h1>
          <p className="mt-2 max-w-xl text-gris-azul">
            Explorá la colección por marca. Filtrá por categoría para acotar por
            familia olfativa.
          </p>
          <div className="mt-8">
            <FiltroTabs
              tabs={tabs}
              activo={filtro}
              onChange={(t) => setFiltro(t as Filtro)}
            />
          </div>
        </div>
      </section>

      {marcasVisibles.length === 0 ? (
        <section className="bg-azul-med">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="text-gris-azul">
              No hay productos en esta categoría.
            </p>
          </div>
        </section>
      ) : (
        marcasVisibles.map((marca) => (
          <MarcaSection
            key={marca}
            marca={marca}
            productos={filtrados}
            staggerKey={filtro}
            className={FONDO_MARCA[marca]}
          />
        ))
      )}
    </>
  );
}
