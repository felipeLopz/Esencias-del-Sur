import { neon } from "@neondatabase/serverless";
import { connection } from "next/server";
import { type Producto } from "@/data/productos";
import {
  productosParaModo,
  resolverFicha,
  type Modo,
} from "@/lib/catalogo";

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
//
// STOCK POR MODO (db/0002_stock_por_modo.sql): la columna `disponible` es el
// stock G5 y `disponible_original` el del modo Original (NULL = sin dato =
// disponible). Todas las funciones reciben `modo`, con "g5" por defecto: sin
// pasarlo, la consulta es exactamente la misma de antes de existir los modos.
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
export async function getDisponibilidad(
  modo: Modo = "g5",
): Promise<Map<string, boolean>> {
  if (!sql) return new Map();

  await connection();

  try {
    // En Original, las filas en NULL (sin dato) se omiten: igual que un slug
    // sin fila, cuentan como disponibles (ver `combinar`).
    const filas = (
      modo === "g5"
        ? await sql`
            SELECT slug, disponible FROM productos_stock
          `
        : await sql`
            SELECT slug, disponible_original AS disponible
            FROM productos_stock
            WHERE disponible_original IS NOT NULL
          `
    ) as { slug: string; disponible: boolean }[];

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

/** Los productos del modo, cada uno con su `disponible` de la base. En G5
 * son los 48; en Original, solo los que tienen precio Original. */
export async function getProductosConStock(
  modo: Modo = "g5",
): Promise<ProductoConStock[]> {
  const mapa = await getDisponibilidad(modo);
  return productosParaModo(modo).map((p) => combinar(p, mapa));
}

/**
 * Lo que muestra la ficha de `slug` pedida en `modoPedido`, con su stock. Si el
 * perfume no se vende en ese modo, trae el del otro modo y un `aviso` (ver
 * `resolverFicha`). undefined solo si el slug no existe. El stock es el del
 * modo que se MUESTRA, que es el que se agrega al carrito.
 */
export async function getFichaConStock(
  slug: string,
  modoPedido: Modo,
): Promise<{ producto: ProductoConStock; aviso?: string } | undefined> {
  const ficha = resolverFicha(slug, modoPedido);
  if (!ficha) return undefined;

  const mapa = await getDisponibilidad(ficha.modo);
  return { producto: combinar(ficha.producto, mapa), aviso: ficha.aviso };
}
