"use client";

import Link from "next/link";
import { useCarrito } from "@/context/CarritoContext";
import { useModoCatalogo } from "@/context/ModoCatalogoContext";
import { formatearPrecio, type Producto } from "@/data/productos";
import {
  MODO_CORTO,
  conservarModo,
  debeMostrarModo,
  presentacionLabel,
} from "@/lib/catalogo";
import { useOverlayCerrable } from "@/lib/useOverlayCerrable";
import { linkPedidoWhatsApp } from "@/lib/whatsapp";

// Drawer lateral (derecha) + overlay. Se monta una vez en el layout raíz y
// anima con transform/opacity (neutralizado por prefers-reduced-motion global).
export default function CartDrawer() {
  const {
    items,
    total,
    drawerAbierto,
    cerrarDrawer,
    actualizarCantidad,
    quitar,
  } = useCarrito();

  // Escape para cerrar + bloqueo de scroll del body mientras está abierto.
  useOverlayCerrable(drawerAbierto, cerrarDrawer);

  const { modoEnUrl, modosVisibles, conModo } = useModoCatalogo();

  // Cada ítem dice su modo (G5 / Original) si los modos están visibles o si
  // hay algo que no es G5. Todo G5 con los modos ocultos: igual que siempre.
  const mostrarModo = debeMostrarModo(
    items.map((i) => i.producto),
    modosVisibles
  );

  // La ficha de un ítem se abre en el modo DEL ÍTEM (el precio que se ve en la
  // ficha es el del carrito). Sin modo en la URL y un ítem G5, el link queda
  // sin `?modo=`, como siempre.
  const hrefFicha = (producto: Producto) =>
    conservarModo(
      `/producto/${producto.slug}`,
      modoEnUrl || producto.modo !== "g5" ? producto.modo : null
    );

  return (
    <>
      <div
        className="drawer-overlay"
        data-abierto={drawerAbierto}
        onClick={cerrarDrawer}
        aria-hidden="true"
      />

      <aside
        className="drawer-panel"
        data-abierto={drawerAbierto}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <header className="flex items-center justify-between border-b border-[var(--tarjeta-borde)] px-5 py-4">
          <p className="font-cinzel text-lg text-blanco">Tu carrito</p>
          <button
            type="button"
            onClick={cerrarDrawer}
            className="label-ui text-sm text-gris-azul transition-colors hover:text-blanco"
          >
            Cerrar ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-gris-azul">Tu carrito está vacío.</p>
            <Link
              href={conModo("/catalogo")}
              onClick={cerrarDrawer}
              className="btn-pill btn-fill label-ui px-6 py-2 text-sm"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--tarjeta-borde)] overflow-y-auto px-5">
              {items.map(({ producto, cantidad }) => (
                <li key={producto.id} className="flex gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="label-ui text-[11px] uppercase text-gris-azul">
                      {producto.marca}
                    </p>
                    <p className="font-cinzel text-base text-blanco">
                      <Link href={hrefFicha(producto)} onClick={cerrarDrawer}>
                        {producto.nombre}
                      </Link>
                    </p>
                    <p className="label-ui mt-0.5 text-xs text-gris-azul">
                      {presentacionLabel(producto)}
                      {mostrarModo && ` · ${MODO_CORTO[producto.modo]}`}
                    </p>
                    <button
                      type="button"
                      onClick={() => quitar(producto.id)}
                      className="label-ui mt-2 text-xs text-gris-azul underline underline-offset-2 transition-colors hover:text-blanco"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3">
                    <p className="text-blanco">
                      {formatearPrecio(producto.precio * cantidad)}
                    </p>
                    <div className="stepper-carrito">
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidad(producto.id, cantidad - 1)
                        }
                        aria-label={`Quitar una unidad de ${producto.nombre}`}
                      >
                        −
                      </button>
                      <span>{cantidad}</span>
                      <button
                        type="button"
                        onClick={() =>
                          actualizarCantidad(producto.id, cantidad + 1)
                        }
                        aria-label={`Agregar una unidad de ${producto.nombre}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-[var(--tarjeta-borde)] px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="label-ui text-sm uppercase tracking-wide text-gris-azul">
                  Total
                </span>
                <span className="text-xl text-blanco">
                  {formatearPrecio(total)}
                </span>
              </div>
              <a
                href={linkPedidoWhatsApp(items, total, { modosVisibles })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-primario label-ui w-full px-6 py-3 text-base"
              >
                Finalizar pedido por WhatsApp
              </a>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
