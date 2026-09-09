import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import DetalleProducto from "@/components/DetalleProducto";
import { getProductoPorSlug, productos } from "@/data/productos";

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

          <div className="mt-8">
            <DetalleProducto producto={producto} />
          </div>
        </div>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
