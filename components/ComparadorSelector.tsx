"use client";

import { useMemo, useState } from "react";
import { useComparador } from "@/context/ComparadorContext";
import { useModoCatalogo } from "@/context/ModoCatalogoContext";
import { productosParaModo } from "@/lib/catalogo";
import CompararButton from "./CompararButton";
import ProductImage from "./ProductImage";

// Normaliza para filtrar sin acentos ni mayúsculas (mismo criterio que el
// buscador del Header, reimplementado acá para no acoplar los dos componentes).
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Pantalla de selección de /comparar: buscador + grilla de los 48 productos.
// Cada tarjeta usa el mismo CompararButton (agrega/quita del
// ComparadorContext, respeta el tope de 3). Una vez elegido al menos uno, la
// BarraComparacion flotante (montada global en el layout) ya queda visible
// con el conteo y el acceso a la tabla — esta pantalla no repite ese botón.
export default function ComparadorSelector() {
  const [consulta, setConsulta] = useState("");
  const { seleccionados, maximo } = useComparador();

  // Productos del modo activo (?modo=). Sin modo elegido, G5: lo de siempre.
  // /comparar es estática: el HTML del build sale siempre en G5 y, si la URL
  // trae otro modo, la grilla se actualiza al cargar en el navegador.
  const { modo } = useModoCatalogo();
  const productos = productosParaModo(modo ?? "g5");

  const termino = normalizar(consulta.trim());

  const resultados = useMemo(() => {
    if (!termino) return productos;
    return productos.filter(
      (p) =>
        normalizar(p.nombre).includes(termino) ||
        normalizar(p.marca).includes(termino) ||
        (p.categoria && normalizar(p.categoria).includes(termino))
    );
  }, [termino, productos]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          inputMode="search"
          autoComplete="off"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Buscar por nombre, marca o categoría…"
          aria-label="Buscar productos para comparar"
          className="buscador-input max-w-sm"
        />
        <p className="label-ui text-sm uppercase tracking-wide text-gris-azul">
          Elegidos {seleccionados.length}/{maximo}
        </p>
      </div>

      {resultados.length === 0 ? (
        <p className="mt-8 text-gris-azul">
          No encontramos resultados para “{consulta.trim()}”.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resultados.map((producto) => (
            <article
              key={producto.id}
              className="tarjeta flex flex-col overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden">
                <ProductImage
                  src={producto.imagen}
                  alt={producto.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-contain"
                />
                {producto.esCasaOriginal && (
                  <span className="badge-original absolute left-2.5 top-2.5 z-10">
                    Original
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="label-ui text-[11px] uppercase text-gris-azul">
                  {producto.categoria ?? producto.marca}
                </p>
                <h3 className="mt-1 font-cinzel text-lg text-blanco">
                  {producto.nombre}
                </h3>
                <p className="mt-2 text-gris-azul">
                  {producto.marca} · {producto.mililitros} ml
                </p>

                <div className="mt-auto pt-4">
                  <CompararButton
                    producto={producto}
                    conTexto
                    className="w-full justify-center"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
