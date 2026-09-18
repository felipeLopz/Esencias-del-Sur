/**
 * Crea la tabla `productos_stock` (db/0001_stock.sql) y siembra un renglón por
 * cada producto de data/productos.ts, en disponible = true.
 *
 * Es idempotente: los productos que ya existen en la tabla NO se tocan (no se
 * les pisa el estado), así se puede volver a correr cuando se agrega stock
 * nuevo a productos.ts.
 *
 *   npm run stock:seed
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { productos } from "../data/productos";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Falta DATABASE_URL (miralo en .env.local).");
  process.exit(1);
}

const sql = neon(connectionString);

const esquema = readFileSync(new URL("../db/0001_stock.sql", import.meta.url), "utf8");

// `neon()` como tag de template no acepta DDL con múltiples statements; para
// el esquema se usa la forma de query directa.
await sql.query(esquema);
console.log("Tabla productos_stock lista.");

const slugs = productos.map((p) => p.slug);
const duplicados = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (duplicados.length > 0) {
  console.error("Hay slugs repetidos en productos.ts: " + duplicados.join(", "));
  process.exit(1);
}

// ON CONFLICT DO NOTHING: respeta lo que ya esté cargado (un producto marcado
// agotado no vuelve a disponible por correr el seed de nuevo).
const filas = await sql.query(
  `INSERT INTO productos_stock (slug)
   SELECT unnest($1::text[])
   ON CONFLICT (slug) DO NOTHING
   RETURNING slug`,
  [slugs],
);

const total = await sql.query(`SELECT count(*)::int AS n FROM productos_stock`);
const disponibles = await sql.query(
  `SELECT count(*)::int AS n FROM productos_stock WHERE disponible`,
);

console.log(`Productos en productos.ts: ${slugs.length}`);
console.log(`Insertados ahora:          ${filas.length}`);
console.log(`Total en la tabla:         ${total[0].n} (disponibles: ${disponibles[0].n})`);
