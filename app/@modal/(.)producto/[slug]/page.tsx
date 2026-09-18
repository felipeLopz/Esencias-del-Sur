import { notFound } from "next/navigation";
import ProductoModal from "@/components/ProductoModal";
import { getProductoConStock } from "@/lib/stock";

// Intercepting route: se activa SOLO en navegación soft dentro del sitio
// (click en una tarjeta). En carga directa cae app/producto/[slug]/page.tsx.
export default async function ProductoInterceptado({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await getProductoConStock(slug);
  if (!producto) notFound();

  return <ProductoModal producto={producto} disponible={producto.disponible} />;
}
