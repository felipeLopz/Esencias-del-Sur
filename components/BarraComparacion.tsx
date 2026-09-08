"use client";

import { useComparador } from "@/context/ComparadorContext";
import ProductImage from "./ProductImage";

// Barra flotante con la selección de comparación.
// Ubicación: en mobile va por encima del botón flotante del carrito
// (bottom-24); desde md queda centrada abajo, con el carrito lejos a la
// derecha. Nunca se superpone con el carrito.
export default function BarraComparacion() {
  const { seleccionados, maximo, limpiar, quitar, abrirModal } =
    useComparador();

  if (seleccionados.length === 0) return null;

  return (
    <div className="fixed inset-x-4 bottom-24 z-50 md:inset-x-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2">
      <div className="barra-comparacion">
        <div className="flex items-center gap-3">
          <p className="label-ui hidden text-xs uppercase tracking-wide text-gris-azul sm:block">
            Comparar {seleccionados.length}/{maximo}
          </p>
          <ul className="flex items-center gap-2">
            {seleccionados.map((producto) => (
              <li key={producto.id} className="relative">
                <div className="relative h-12 w-10 overflow-hidden rounded-lg border border-[var(--tarjeta-borde)]">
                  <ProductImage
                    src={producto.imagen}
                    alt={producto.nombre}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => quitar(producto.id)}
                  aria-label={`Quitar ${producto.nombre} de la comparación`}
                  title={`Quitar ${producto.nombre}`}
                  className="chip-quitar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={limpiar}
            className="label-ui text-xs text-gris-azul transition-colors hover:text-blanco"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={abrirModal}
            className="btn-pill btn-primario label-ui px-5 py-2 text-sm"
          >
            Comparar
          </button>
        </div>
      </div>
    </div>
  );
}
