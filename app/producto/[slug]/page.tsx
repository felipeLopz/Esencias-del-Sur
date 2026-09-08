import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import ProductImage from "@/components/ProductImage";
import AgregarAlCarrito from "@/components/AgregarAlCarrito";
import {
  formatearPrecio,
  getProductoPorSlug,
  productos,
} from "@/data/productos";

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = getProductoPorSlug(slug);
  if (!producto) return { title: "Producto no encontrado — Esencias del Sur" };
  return {
    title: `${producto.nombre} — Esencias del Sur`,
    description: producto.descripcion,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = getProductoPorSlug(slug);
  if (!producto) notFound();

  return (
    <>
      <Header />

      <main className="bg-azul-osc">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Link
            href="/catalogo"
            className="label-ui text-sm text-gris-azul hover:text-blanco"
          >
            ← Volver al catálogo
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="tarjeta relative aspect-[3/4] overflow-hidden">
              <ProductImage
                src={producto.imagen}
                alt={producto.nombre}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="label-ui text-xs uppercase tracking-wide text-gris-azul">
                {producto.categoria}
              </p>
              <h1 className="mt-2 font-cinzel text-4xl text-blanco">
                {producto.nombre}
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gris-azul">
                {producto.descripcion}
              </p>

              <div className="mt-8 flex items-end gap-6">
                <div>
                  <p className="label-ui text-xs uppercase text-gris-azul">
                    Precio
                  </p>
                  <p className="text-3xl text-blanco">
                    {formatearPrecio(producto.precio)}
                  </p>
                </div>
                <div>
                  <p className="label-ui text-xs uppercase text-gris-azul">
                    Tamaño
                  </p>
                  <p className="text-3xl text-blanco">{producto.tamano}</p>
                </div>
              </div>

              <div className="mt-10">
                <AgregarAlCarrito producto={producto} size="lg" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
