import { notFound } from "next/navigation";
import ProductoModal from "@/components/ProductoModal";
import { getProductoPorSlug } from "@/data/productos";

// Intercepting route: se activa SOLO en navegación soft dentro del sitio
// (click en una tarjeta). En carga directa cae app/producto/[slug]/page.tsx.
export default async function ProductoInterceptado({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = getProductoPorSlug(slug);
  if (!producto) notFound();

  return <ProductoModal producto={producto} />;
}
