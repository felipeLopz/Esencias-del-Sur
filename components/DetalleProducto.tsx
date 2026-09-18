import ProductImage from "./ProductImage";
import AgregarAlCarrito from "./AgregarAlCarrito";
import { formatearPrecio, type Producto } from "@/data/productos";
import { tamanoLabel } from "@/lib/agrupacion";

// Contenido del detalle de producto, compartido por la página completa
// (/producto/[slug]) y el modal interceptado. Presentacional: no trae Header
// ni Footer ni wrapper de página.
//
// `enModal` baja el heading a <h2> (dentro de un dialog no debe haber otro
// <h1> compitiendo con el de la página de fondo).
export default function DetalleProducto({
  producto,
  enModal = false,
  disponible = true,
}: {
  producto: Producto;
  enModal?: boolean;
  /** Estado de stock leído de la base (lib/stock.ts). */
  disponible?: boolean;
}) {
  const Heading = enModal ? "h2" : "h1";
  const agotado = !disponible;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="tarjeta relative aspect-square overflow-hidden">
        <ProductImage
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain ${agotado ? "opacity-40" : ""}`}
          priority
        />
        {agotado && (
          <span className="badge-agotado pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-3">
          <p className="label-ui text-xs uppercase tracking-wide text-gris-azul">
            {producto.marca}
            {producto.categoria ? ` · ${producto.categoria}` : ""}
          </p>
          <span className="badge-genero">{producto.genero}</span>
          {producto.original && (
            <span className="badge-original">Original</span>
          )}
        </div>
        <Heading className="mt-2 font-cinzel text-3xl text-blanco sm:text-4xl">
          {producto.nombre}
        </Heading>

        {producto.descripcion && (
          <p className="mt-5 text-lg leading-relaxed text-gris-azul">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-7 flex items-end gap-8">
          <div>
            <p className="label-ui text-xs uppercase text-gris-azul">Precio</p>
            <p className="text-3xl text-blanco">
              {formatearPrecio(producto.precio)}
            </p>
          </div>
          <div>
            <p className="label-ui text-xs uppercase text-gris-azul">Tamaño</p>
            <p className="text-xl text-blanco">
              {tamanoLabel(producto.mililitros)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <AgregarAlCarrito producto={producto} size="lg" agotado={agotado} />
          {agotado && (
            <p className="text-gris-azul">
              Sin stock por ahora. Escribinos por WhatsApp y lo encargamos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
