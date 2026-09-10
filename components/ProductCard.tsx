import Link from "next/link";
import { formatearPrecio, type Producto } from "@/data/productos";
import { tamanoLabel } from "@/lib/agrupacion";
import ProductImage from "./ProductImage";
import AgregarAlCarrito from "./AgregarAlCarrito";
import CompararButton from "./CompararButton";

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <article className="tarjeta group flex flex-col overflow-hidden">
      <Link
        href={`/producto/${producto.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <ProductImage
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Fuera del <Link> de la imagen para no anidar interactivos */}
      <div className="absolute right-2.5 top-2.5 z-10">
        <CompararButton producto={producto} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="label-ui text-[11px] uppercase text-gris-azul">
          {producto.categoria ?? producto.marca}
        </p>
        <h3 className="mt-1 font-cinzel text-lg text-blanco">
          <Link href={`/producto/${producto.slug}`}>{producto.nombre}</Link>
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
          <AgregarAlCarrito producto={producto} size="sm" />
        </div>
      </div>
    </article>
  );
}
