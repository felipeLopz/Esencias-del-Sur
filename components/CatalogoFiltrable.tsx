"use client";

import { useMemo, useState } from "react";
import { CATEGORIAS, type Producto } from "@/data/productos";
import ProductCard from "./ProductCard";
import FiltroTabs from "./FiltroTabs";

type Filtro = "Todos" | (typeof CATEGORIAS)[number];

export default function CatalogoFiltrable({
  productos,
}: {
  productos: Producto[];
}) {
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const tabs: string[] = ["Todos", ...CATEGORIAS];

  const visibles = useMemo(
    () =>
      filtro === "Todos"
        ? productos
        : productos.filter((p) => p.categoria === filtro),
    [filtro, productos]
  );

  return (
    <div>
      <div className="mb-8">
        <FiltroTabs
          tabs={tabs}
          activo={filtro}
          onChange={(t) => setFiltro(t as Filtro)}
        />
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
