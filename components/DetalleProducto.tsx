import ProductImage from "./ProductImage";
import CompraProducto from "./CompraProducto";
import { type Producto } from "@/data/productos";

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
  aviso,
}: {
  /** Ya resuelto en el modo que se muestra (lib/catalogo.ts: resolverFicha). */
  producto: Producto;
  enModal?: boolean;
  /** Estado de stock leído de la base (lib/stock.ts). */
  disponible?: boolean;
  /**
   * Aviso si se muestra otro modo del pedido (ej. se pidió Original y el
   * perfume solo está en G5). Ver `resolverFicha`.
   */
  aviso?: string;
}) {
  const Heading = enModal ? "h2" : "h1";
  const agotado = !disponible;

  return (
    <>
      {aviso && (
        <p role="status" className="tarjeta mb-8 px-5 py-4 text-blanco">
          {aviso}
        </p>
      )}
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
            {producto.esCasaOriginal && (
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

          {/* Precio, tamaño, selector frasco/decant y botón de compra. */}
          <CompraProducto producto={producto} agotado={agotado} />
        </div>
      </div>
    </>
  );
}
