import { neon } from "@neondatabase/serverless";
import { connection } from "next/server";
import { productos, type Producto } from "@/data/productos";

// ============================================================================
// STOCK (disponible / agotado) — lectura server-side
// ----------------------------------------------------------------------------
// data/productos.ts sigue siendo la fuente de nombre, marca, precio,
// descripción, imagen, género y categoría: eso es estático y se versiona.
// Lo ÚNICO que vive en la base es `disponible`, para poder marcar agotados
// desde /admin sin tocar código ni hacer deploy.
//
// `connection()` (next/server) marca el punto donde termina el prerender: al
// llamarlo acá adentro, cualquier página que lea stock pasa sola a render
// dinámico y consulta la base en cada visita, sin tener que repetir config en
// cada page.tsx. Ver el resumen de la tarea para qué rutas dejaron de ser
// estáticas por esto.
// ============================================================================

const connectionString = process.env.DATABASE_URL;

const sql = connectionString ? neon(connectionString) : null;

export type ProductoConStock = Producto & { disponible: boolean };

/**
 * Mapa slug -> disponible, leído de la base en cada request.
 *
 * Falla "abierto": si no hay DATABASE_URL o la consulta se cae, devuelve el
 * catálogo entero como disponible en vez de romper la página. Es una tienda
 * con pedido por WhatsApp: mostrar de más y coordinar a mano es mucho menos
 * grave que tirar abajo el catálogo por un problema de base.
 */
export async function getDisponibilidad(): Promise<Map<string, boolean>> {
  if (!sql) return new Map();

  await connection();

  try {
    const filas = (await sql`
      SELECT slug, disponible FROM productos_stock
    `) as { slug: string; disponible: boolean }[];

    return new Map(filas.map((f) => [f.slug, f.disponible]));
  } catch (error) {
    console.error("[stock] no se pudo leer productos_stock:", error);
    return new Map();
  }
}

/** Un producto sin fila en la tabla se considera disponible (ver seed). */
function combinar(producto: Producto, mapa: Map<string, boolean>): ProductoConStock {
  return { ...producto, disponible: mapa.get(producto.slug) ?? true };
}

/** Los 48 productos estáticos, cada uno con su `disponible` de la base. */
export async function getProductosConStock(): Promise<ProductoConStock[]> {
  const mapa = await getDisponibilidad();
  return productos.map((p) => combinar(p, mapa));
}

/** Un producto puntual (detalle / modal) con su `disponible` de la base. */
export async function getProductoConStock(
  slug: string,
): Promise<ProductoConStock | undefined> {
  const producto = productos.find((p) => p.slug === slug);
  if (!producto) return undefined;

  const mapa = await getDisponibilidad();
  return combinar(producto, mapa);
}
