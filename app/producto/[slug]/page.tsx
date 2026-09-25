import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import DetalleProducto from "@/components/DetalleProducto";
import LinkConModo from "@/components/LinkConModo";
import { getProductoPorSlug } from "@/data/productos";
import { PARAM_MODO, resolverModo } from "@/lib/catalogo";
import { MODOS_CATALOGO_VISIBLE } from "@/lib/config";
import { getFichaConStock } from "@/lib/stock";

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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  // Modo pedido por la URL. La ficha no pregunta: sin modo, G5 (lo de siempre).
  // Si el perfume no se vende en ese modo se muestra el otro con un aviso, no
  // un 404 (ver resolverFicha en lib/catalogo.ts).
  const valorModo = [(await searchParams)[PARAM_MODO]].flat()[0];
  const modoPedido = resolverModo(valorModo, MODOS_CATALOGO_VISIBLE) ?? "g5";
  const ficha = await getFichaConStock(slug, modoPedido);
  if (!ficha) notFound();
  const { producto, aviso } = ficha;

  return (
    <>
      <Header />

      <main className="bg-azul-osc">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <LinkConModo
            href="/catalogo"
            className="label-ui text-sm text-gris-azul hover:text-blanco"
          >
            ← Volver al catálogo
          </LinkConModo>

          <div className="mt-8">
            <DetalleProducto
              producto={producto}
              disponible={producto.disponible}
              aviso={aviso}
            />
          </div>
        </div>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
