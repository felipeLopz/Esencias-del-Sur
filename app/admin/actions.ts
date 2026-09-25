"use server";

import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";
import { productos } from "@/data/productos";
import { esModo, type Modo } from "@/lib/catalogo";
import { NOMBRE_COOKIE, tokenValido } from "@/lib/sesion";

type Resultado = { ok: true; disponible: boolean } | { ok: false; error: string };

const SLUGS_VALIDOS = new Set(productos.map((p) => p.slug));

/**
 * Marca un producto como disponible o agotado EN UN MODO: "g5" escribe la
 * columna `disponible` (lo de siempre) y "original" la columna
 * `disponible_original` (ver db/0002_stock_por_modo.sql).
 *
 * El middleware ya bloquea /admin, pero un server action se puede invocar
 * directo por POST sin pasar por él: por eso se revalida la cookie de sesión
 * acá adentro también. El slug se valida contra productos.ts y el modo contra
 * los modos válidos, para no permitir escribir filas ni columnas arbitrarias.
 */
export async function cambiarDisponibilidad(
  slug: string,
  disponible: boolean,
  modo: Modo = "g5",
): Promise<Resultado> {
  const secreto = process.env.SESSION_SECRET;
  const jar = await cookies();
  const cookie = jar.get(NOMBRE_COOKIE)?.value;

  if (!secreto || !(await tokenValido(cookie, secreto))) {
    return { ok: false, error: "Sesión vencida. Recargá e ingresá el PIN de nuevo." };
  }

  if (!SLUGS_VALIDOS.has(slug)) {
    return { ok: false, error: "Ese producto no existe." };
  }

  if (!esModo(modo) || typeof disponible !== "boolean") {
    return { ok: false, error: "Pedido inválido." };
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return { ok: false, error: "Falta DATABASE_URL en el servidor." };
  }

  try {
    const sql = neon(connectionString);
    // Una query fija por columna (no se arma el nombre de columna con texto).
    // Si la fila no existía, en modo Original `disponible` (G5) queda en su
    // default (true): tocar el stock Original no toca el G5.
    const filas = (
      modo === "g5"
        ? await sql`
            INSERT INTO productos_stock (slug, disponible, actualizado_at)
            VALUES (${slug}, ${disponible}, now())
            ON CONFLICT (slug)
            DO UPDATE SET disponible = ${disponible}, actualizado_at = now()
            RETURNING disponible
          `
        : await sql`
            INSERT INTO productos_stock (slug, disponible_original, actualizado_at)
            VALUES (${slug}, ${disponible}, now())
            ON CONFLICT (slug)
            DO UPDATE SET disponible_original = ${disponible}, actualizado_at = now()
            RETURNING disponible_original AS disponible
          `
    ) as { disponible: boolean }[];

    return { ok: true, disponible: filas[0].disponible };
  } catch (error) {
    console.error("[admin] no se pudo actualizar el stock:", error);
    return { ok: false, error: "No se pudo guardar. Probá de nuevo." };
  }
}
