import { notFound } from "next/navigation";
import ProductoModal from "@/components/ProductoModal";
import { PARAM_MODO, resolverModo } from "@/lib/catalogo";
import { MODOS_CATALOGO_VISIBLE } from "@/lib/config";
import { getFichaConStock } from "@/lib/stock";

// Intercepting route: se activa SOLO en navegación soft dentro del sitio
// (click en una tarjeta). En carga directa cae app/producto/[slug]/page.tsx.
// Resuelve el modo igual que esa página (sin modo: G5; perfume que no se vende
// en el modo pedido: el otro modo con aviso, no 404).
export default async function ProductoInterceptado({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const valorModo = [(await searchParams)[PARAM_MODO]].flat()[0];
  const modoPedido = resolverModo(valorModo, MODOS_CATALOGO_VISIBLE) ?? "g5";
  const ficha = await getFichaConStock(slug, modoPedido);
  if (!ficha) notFound();

  return (
    <ProductoModal
      producto={ficha.producto}
      disponible={ficha.producto.disponible}
      aviso={ficha.aviso}
    />
  );
}
