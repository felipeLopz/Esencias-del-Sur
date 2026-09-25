"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOverlayCerrable } from "@/lib/useOverlayCerrable";
import DetalleProducto from "./DetalleProducto";
import type { Producto } from "@/data/productos";

// Cáscara del modal para la intercepting route. Cierra volviendo atrás en el
// historial (router.back), así la URL /producto/[slug] queda "consumida" y el
// usuario vuelve a donde estaba. Escape / overlay / botón, vía useOverlayCerrable.
export default function ProductoModal({
  producto,
  disponible = true,
  aviso,
}: {
  producto: Producto;
  /** Estado de stock leído de la base (lib/stock.ts). */
  disponible?: boolean;
  /** Aviso si se muestra otro modo del pedido (ver DetalleProducto). */
  aviso?: string;
}) {
  const router = useRouter();
  const cerrar = useCallback(() => router.back(), [router]);

  useOverlayCerrable(true, cerrar);

  // Animación de entrada: se monta cerrado y se abre en el siguiente frame.
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAbierto(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <div
        className="modal-overlay"
        data-abierto={abierto}
        onClick={cerrar}
        aria-hidden="true"
      />
      <div
        className="modal-panel modal-panel--producto"
        data-abierto={abierto}
        role="dialog"
        aria-modal="true"
        aria-label={producto.nombre}
      >
        <header className="flex items-center justify-end border-b border-[var(--tarjeta-borde)] px-5 py-3">
          <button
            type="button"
            onClick={cerrar}
            className="label-ui text-sm text-gris-azul transition-colors hover:text-blanco"
          >
            Cerrar ✕
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <DetalleProducto
            producto={producto}
            enModal
            disponible={disponible}
            aviso={aviso}
          />
        </div>
      </div>
    </>
  );
}
