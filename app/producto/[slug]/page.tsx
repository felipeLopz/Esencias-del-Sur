import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import DetalleProducto from "@/components/DetalleProducto";
import { getProductoPorSlug } from "@/data/productos";
import { getProductoConStock } from "@/lib/stock";

// Antes había `generateStaticParams` y las 48 fichas se prerenderizaban. Ya no:
// el estado agotado/disponible se lee de la base en cada visita, así que la
// ruta pasó a render dinámico (ver resumen de la tarea).

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
  const producto = await getProductoConStock(slug);
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

          <div className="mt-8">
            <DetalleProducto
              producto={producto}
              disponible={producto.disponible}
            />
          </div>
        </div>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
