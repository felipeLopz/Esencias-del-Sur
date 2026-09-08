"use client";

import Link from "next/link";
import { useComparador } from "@/context/ComparadorContext";
import { formatearPrecio } from "@/data/productos";
import { formatoLabel } from "@/lib/formato";
import { useOverlayCerrable } from "@/lib/useOverlayCerrable";
import ProductImage from "./ProductImage";

// Modal comparador: productos en columnas, atributos en filas.
// Cierra con Escape / overlay / botón, reusando useOverlayCerrable (el mismo
// comportamiento que CartDrawer).
export default function ComparadorModal() {
  const { seleccionados, modalAbierto, cerrarModal, quitar } = useComparador();

  useOverlayCerrable(modalAbierto, cerrarModal);

  const filas: { label: string; render: (i: number) => React.ReactNode }[] = [
    {
      label: "Marca",
      render: (i) => seleccionados[i].marca,
    },
    {
      label: "Categoría",
      render: (i) => seleccionados[i].categoria,
    },
    {
      label: "Formato",
      render: (i) => {
        const { formato, tamano } = seleccionados[i];
        const label = formatoLabel(formato);
        // Evita "Grande · 50 ml · 50 ml": solo suma el tamaño declarado si
        // aporta algo que el label del formato no dice ya.
        const normalizar = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        return normalizar(label).includes(normalizar(tamano))
          ? label
          : `${label} · ${tamano}`;
      },
    },
    {
      label: "Precio",
      render: (i) => (
        <span className="text-lg text-blanco">
          {formatearPrecio(seleccionados[i].precio)}
        </span>
      ),
    },
    {
      label: "Descripción",
      render: (i) => (
        <span className="text-gris-azul">{seleccionados[i].descripcion}</span>
      ),
    },
  ];

  return (
    <>
      <div
        className="modal-overlay"
        data-abierto={modalAbierto}
        onClick={cerrarModal}
        aria-hidden="true"
      />

      <div
        className="modal-panel"
        data-abierto={modalAbierto}
        role="dialog"
        aria-modal="true"
        aria-label="Comparar productos"
      >
        <header className="flex items-center justify-between border-b border-[var(--tarjeta-borde)] px-5 py-4">
          <p className="font-cinzel text-lg text-blanco">Comparar productos</p>
          <button
            type="button"
            onClick={cerrarModal}
            className="label-ui text-sm text-gris-azul transition-colors hover:text-blanco"
          >
            Cerrar ✕
          </button>
        </header>

        <div className="flex-1 overflow-auto px-5 py-5">
          {seleccionados.length === 0 ? (
            <p className="text-gris-azul">
              No hay productos seleccionados para comparar.
            </p>
          ) : (
            <table className="w-full min-w-[560px] border-collapse text-left align-top">
              <thead>
                <tr>
                  <th className="w-28 p-2" />
                  {seleccionados.map((producto) => (
                    <th key={producto.id} className="p-2 align-top">
                      {/* Alto fijo y chico: la gracia del comparador es ver
                          los atributos, no las fotos a pantalla completa. */}
                      <div className="tarjeta relative h-32 overflow-hidden sm:h-40">
                        <ProductImage
                          src={producto.imagen}
                          alt={producto.nombre}
                          fill
                          sizes="(max-width: 768px) 40vw, 240px"
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-3 font-cinzel text-base font-normal text-blanco">
                        <Link
                          href={`/producto/${producto.slug}`}
                          onClick={cerrarModal}
                        >
                          {producto.nombre}
                        </Link>
                      </p>
                      <button
                        type="button"
                        onClick={() => quitar(producto.id)}
                        className="label-ui mt-1 text-xs font-normal text-gris-azul underline underline-offset-2 transition-colors hover:text-blanco"
                      >
                        Quitar
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr
                    key={fila.label}
                    className="border-t border-[var(--tarjeta-borde)]"
                  >
                    <th
                      scope="row"
                      className="label-ui p-2 align-top text-xs font-normal uppercase tracking-wide text-gris-azul"
                    >
                      {fila.label}
                    </th>
                    {seleccionados.map((producto, i) => (
                      <td key={producto.id} className="p-2 align-top">
                        {fila.render(i)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
