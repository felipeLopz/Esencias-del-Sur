import { formatearPrecio, type Producto } from "@/data/productos";
import { tamanoLabel } from "@/lib/agrupacion";
import ProductImage from "./ProductImage";
import AgregarAlCarrito from "./AgregarAlCarrito";
import LinkConModo from "./LinkConModo";

export default function ProductCard({
  producto,
  disponible = true,
}: {
  producto: Producto;
  /**
   * Estado de stock leído de la base (lib/stock.ts). Por defecto `true`: las
   * superficies que todavía no consultan stock (quiz, comparador) siguen
   * mostrando la tarjeta como siempre en vez de romperse.
   */
  disponible?: boolean;
}) {
  const agotado = !disponible;

  return (
    <article className="tarjeta group flex flex-col overflow-hidden">
      <LinkConModo
        href={`/producto/${producto.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <ProductImage
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className={`object-contain transition-transform duration-500 group-hover:scale-105 ${
            agotado ? "opacity-40" : ""
          }`}
        />
      </LinkConModo>

      {/* Centrado sobre la foto: no pelea con "Original" (arriba izquierda)
          ni con el género (arriba derecha), y se lee de un vistazo. */}
      {agotado && (
        <span className="badge-agotado pointer-events-none absolute left-1/2 top-[28%] z-10 -translate-x-1/2">
          Agotado
        </span>
      )}

      {/* Overlays fuera del <Link> de la imagen para no anidar interactivos.
          "Original" (opcional) a la izquierda, género (siempre presente) a
          la derecha: no compiten porque van en esquinas opuestas. */}
      {producto.esCasaOriginal && (
        <span className="badge-original absolute left-2.5 top-2.5 z-10">
          Original
        </span>
      )}
      <span className="badge-genero absolute right-2.5 top-2.5 z-10">
        {producto.genero}
      </span>

      <div className="flex flex-1 flex-col p-4">
        <p className="label-ui text-[11px] uppercase text-gris-azul">
          {producto.categoria ?? producto.marca}
        </p>
        <h3 className="mt-1 font-cinzel text-lg text-blanco">
          <LinkConModo href={`/producto/${producto.slug}`}>
            {producto.nombre}
          </LinkConModo>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-gris-azul">
          {producto.descripcion}
        </p>

        <div className="mt-3 flex min-h-[34px] items-center justify-between gap-3">
          <div>
            <p className="text-lg text-blanco">
              {formatearPrecio(producto.precio)}
            </p>
            <p className="label-ui text-xs text-gris-azul">{tamanoLabel(producto.mililitros)}</p>
          </div>
          <AgregarAlCarrito producto={producto} size="sm" agotado={agotado} />
        </div>
      </div>
    </article>
  );
}
