"use client";

import { useComparador } from "@/context/ComparadorContext";
import type { Producto } from "@/data/productos";

// Botón para agregar/quitar un producto de la comparación.
// - Activo   → pill relleno (--blanco) con el ícono en --azul-negro.
// - Inactivo → pill outline.
// - Tope alcanzado y este producto no está elegido → deshabilitado + tooltip.
export default function CompararButton({
  producto,
  conTexto = false,
  className = "",
}: {
  producto: Producto;
  conTexto?: boolean;
  className?: string;
}) {
  const { estaSeleccionado, alternar, lleno, maximo } = useComparador();

  const activo = estaSeleccionado(producto.id);
  const deshabilitado = !activo && lleno;

  const titulo = deshabilitado
    ? `Ya elegiste ${maximo} productos para comparar. Quitá uno para agregar este.`
    : activo
      ? `Quitar ${producto.nombre} de la comparación`
      : `Comparar ${producto.nombre}`;

  return (
    <button
      type="button"
      onClick={() => alternar(producto)}
      disabled={deshabilitado}
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      data-activo={activo}
      className={`btn-comparar ${conTexto ? "btn-comparar--texto" : ""} ${className}`}
    >
      {/* Balanza */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3v18" />
        <path d="M5 7h14" />
        <path d="M8 3h8" />
        <path d="m2 12 3-5 3 5a3 3 0 0 1-6 0Z" />
        <path d="m16 12 3-5 3 5a3 3 0 0 1-6 0Z" />
      </svg>
      {conTexto && (
        <span>{activo ? "En comparación" : "Comparar"}</span>
      )}
    </button>
  );
}
