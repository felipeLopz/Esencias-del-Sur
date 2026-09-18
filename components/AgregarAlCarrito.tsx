"use client";

import { useEffect, useRef, useState } from "react";
import { useCarrito } from "@/context/CarritoContext";
import type { Producto } from "@/data/productos";

// Reemplaza al viejo ConsultarButton (placeholder + check).
// Flujo: "Agregar al carrito" → check ✓ ~1s (mismo feedback de antes) →
// selector −/+ mientras el producto siga en el carrito.
export default function AgregarAlCarrito({
  producto,
  size = "sm",
  className = "",
  agotado = false,
}: {
  producto: Producto;
  size?: "sm" | "lg";
  className?: string;
  /** Sin stock (viene de la base, ver lib/stock.ts): no se puede agregar. */
  agotado?: boolean;
}) {
  const { cantidadDe, agregar, actualizarCantidad } = useCarrito();
  const cantidad = cantidadDe(producto.id);

  const [confirmado, setConfirmado] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pad = size === "lg" ? "px-8 py-3 text-base" : "px-5 py-2 text-sm";
  const label = size === "lg" ? "Agregar al carrito" : "Agregar";

  // Agotado gana sobre todo lo demás. Si ya estaba en el carrito de alguien
  // cuando se marcó agotado, el stepper de esa unidad se sigue viendo abajo
  // (a propósito: no se le vacía el carrito al cliente).
  if (agotado && cantidad === 0) {
    return (
      <button
        type="button"
        disabled
        aria-label={`${producto.nombre} está agotado`}
        className={`btn-pill btn-secundario label-ui cursor-not-allowed opacity-50 ${pad} ${className}`}
      >
        Agotado
      </button>
    );
  }

  if (confirmado) {
    return (
      <span
        className={`btn-pill btn-primario label-ui ${pad} ${className}`}
        aria-live="polite"
      >
        <span className="check-pop" aria-hidden="true">
          ✓
        </span>
        <span className="sr-only">Agregado al carrito</span>
      </span>
    );
  }

  if (cantidad > 0) {
    return (
      <div
        className={`stepper-carrito ${size === "lg" ? "stepper-lg" : ""} ${className}`}
      >
        <button
          type="button"
          onClick={() => actualizarCantidad(producto.id, cantidad - 1)}
          aria-label={`Quitar una unidad de ${producto.nombre}`}
        >
          −
        </button>
        <span aria-live="polite">{cantidad}</span>
        <button
          type="button"
          onClick={() => actualizarCantidad(producto.id, cantidad + 1)}
          aria-label={`Agregar una unidad de ${producto.nombre}`}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        agregar(producto);
        setConfirmado(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setConfirmado(false), 1000);
      }}
      className={`btn-pill btn-primario label-ui ${pad} ${className}`}
    >
      {label}
    </button>
  );
}
