"use client";

import { useState } from "react";
import { formatearPrecio, type Producto } from "@/data/productos";
import { decantDe, presentacionLabel } from "@/lib/catalogo";
import AgregarAlCarrito from "./AgregarAlCarrito";
import FiltroTabs from "./FiltroTabs";

const FRASCO = "Frasco completo";
const DECANT = "Decant 5 ml";

// Precio, tamaño y botón de compra de la ficha (página y modal).
//
// Si el producto (ya resuelto en su modo) tiene `precioDecant`, suma arriba un
// selector "Frasco completo / Decant 5 ml" que cambia el precio mostrado y lo
// que se agrega al carrito: el decant es otro ítem (`decantDe`), con su propio
// id, marcado `esDecant`. Sin decant en ese modo no aparece el selector y el
// bloque queda exactamente como era antes.
//
// El stock del decant es el del frasco: si el perfume está agotado, tampoco
// hay decant.
export default function CompraProducto({
  producto,
  agotado,
}: {
  producto: Producto;
  agotado: boolean;
}) {
  const decant = decantDe(producto);
  const [presentacion, setPresentacion] = useState(FRASCO);
  const elegido = decant && presentacion === DECANT ? decant : producto;

  return (
    <>
      {decant && (
        <div className="mt-7">
          <p className="label-ui mb-2 text-xs uppercase text-gris-azul">
            Presentación
          </p>
          <FiltroTabs
            tabs={[FRASCO, DECANT]}
            activo={presentacion}
            onChange={setPresentacion}
          />
        </div>
      )}

      <div className="mt-7 flex items-end gap-8">
        <div>
          <p className="label-ui text-xs uppercase text-gris-azul">Precio</p>
          <p className="text-3xl text-blanco">
            {formatearPrecio(elegido.precio)}
          </p>
        </div>
        <div>
          <p className="label-ui text-xs uppercase text-gris-azul">Tamaño</p>
          <p className="text-xl text-blanco">{presentacionLabel(elegido)}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {/* `key`: al cambiar de presentación el botón arranca de cero (no
            arrastra el check de "agregado" del otro ítem). */}
        <AgregarAlCarrito
          key={elegido.id}
          producto={elegido}
          size="lg"
          agotado={agotado}
        />
        {agotado && (
          <p className="text-gris-azul">
            Sin stock por ahora. Escribinos por WhatsApp y lo encargamos.
          </p>
        )}
      </div>
    </>
  );
}
