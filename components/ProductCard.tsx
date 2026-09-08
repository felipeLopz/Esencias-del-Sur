import Link from "next/link";
import { formatearPrecio, type Producto } from "@/data/productos";
import ProductImage from "./ProductImage";
import AgregarAlCarrito from "./AgregarAlCarrito";
import CompararButton from "./CompararButton";

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <article className="tarjeta group flex flex-col overflow-hidden">
      <Link
        href={`/producto/${producto.slug}`}
        className="relative block aspect-[3/4] overflow-hidden"
      >
        <ProductImage
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Fuera del <Link> de la imagen para no anidar interactivos */}
      <div className="absolute right-3 top-3 z-10">
        <CompararButton producto={producto} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="label-ui text-[11px] uppercase text-gris-azul">
          {producto.categoria}
        </p>
        <h3 className="mt-1 font-cinzel text-lg text-blanco">
          <Link href={`/producto/${producto.slug}`}>{producto.nombre}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-gris-azul">
          {producto.descripcion}
        </p>

        <div className="mt-4 flex min-h-[34px] items-center justify-between gap-3">
          <div>
            <p className="text-lg text-blanco">
              {formatearPrecio(producto.precio)}
            </p>
            <p className="label-ui text-xs text-gris-azul">{producto.tamano}</p>
          </div>
          <AgregarAlCarrito producto={producto} size="sm" />
        </div>
      </div>
    </article>
  );
}
