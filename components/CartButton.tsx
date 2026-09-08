"use client";

import { useCarrito } from "@/context/CarritoContext";

// Trigger del carrito: ícono + badge de cantidad, abre el drawer.
// Se usa en el Header (default) y en el botón flotante (con otras clases).
export default function CartButton({
  className = "relative inline-flex items-center text-blanco/90 transition-colors hover:text-blanco",
  badgeClassName = "badge-carrito",
}: {
  className?: string;
  badgeClassName?: string;
}) {
  const { cantidadTotal, hidratado, abrirDrawer } = useCarrito();
  const mostrarBadge = hidratado && cantidadTotal > 0;

  return (
    <button
      type="button"
      onClick={abrirDrawer}
      aria-label={
        mostrarBadge
          ? `Abrir carrito (${cantidadTotal} ${
              cantidadTotal === 1 ? "producto" : "productos"
            })`
          : "Abrir carrito"
      }
      className={className}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {mostrarBadge && (
        <span className={badgeClassName} aria-hidden="true">
          {cantidadTotal}
        </span>
      )}
    </button>
  );
}
