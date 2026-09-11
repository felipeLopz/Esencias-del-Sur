// ============================================================================
// DATOS DE PRODUCTOS — STOCK REAL
// ----------------------------------------------------------------------------
// Nombres, tamaños y precios cargados del stock real del negocio.
//
// PENDIENTE de completar:
//   - `descripcion`: opcional, todavía sin cargar para ningún producto.
//   - `categoria`: opcional. Solo se asignó donde el nombre o la línea lo hacen
//     evidente; el resto queda SIN categoría a propósito (no se inventaron).
//
// Para agregar un producto: sumá una entrada al array. El `id` y la `imagen`
// se completan solos (ver `definir` abajo); el `slug` va a mano y tiene que ser
// único (si dos productos comparten nombre, desambiguar con el tamaño,
// ej. "eclaire" / "eclaire-50ml").
// ============================================================================

export type Categoria =
  | "Oud & Ámbar"
  | "Floral"
  | "Fresco / Cítrico"
  | "Sets regalo";

export const CATEGORIAS: Categoria[] = [
  "Oud & Ámbar",
  "Floral",
  "Fresco / Cítrico",
  "Sets regalo",
];

// Marca dejó de ser un union cerrado: el stock real tiene ~20 líneas distintas
// y crece. Se deriva de los datos (ver MARCAS al final del archivo).
export type Marca = string;

// Marca paraguas para los productos sueltos que no forman una línea con varios
// SKUs. Se renderiza siempre al final del listado de marcas.
export const MARCA_OTRAS = "Otras marcas";

export interface Producto {
  id: number;
  slug: string;
  nombre: string;
  marca: Marca;
  /** Tamaño del frasco en mililitros. Reemplaza al viejo enum `Formato`. */
  mililitros: number;
  precio: number;
  imagen: string;
  categoria?: Categoria;
  descripcion?: string;
  /** Se muestra en el carrusel "Destacados" de la Home. Mantener 3 marcados. */
  destacado?: boolean;
  /**
   * Fragancia original / de autor (no una línea inspirada o "dupe" de otra
   * marca). Se muestra como pill "Original" en la UI. Ausente = no se afirma
   * nada; NO implica que sea un dupe.
   */
  original?: boolean;
}

type ProductoInput = Omit<Producto, "id" | "imagen"> & { imagen?: string };

// Autoasigna `id` correlativo e `imagen` según el slug: cada producto usa su
// foto real en /public/productos/<slug>.png. Los 48 productos actuales tienen
// foto; si se agrega uno sin foto todavía, pasarle `imagen` explícita.
function definir(items: ProductoInput[]): Producto[] {
  return items.map((p, i) => ({
    ...p,
    id: i + 1,
    imagen: p.imagen ?? `/productos/${p.slug}.png`,
  }));
}

export const productos: Producto[] = definir([
  // ---------------------------------------------------------------- Hawas ---
  { slug: "hawas-viper", nombre: "Hawas Viper", marca: "Hawas", mililitros: 100, precio: 39900 },
  { slug: "hawas-pink", nombre: "Hawas Pink", marca: "Hawas", mililitros: 100, precio: 39900 },
  { slug: "hawas-fire", nombre: "Hawas Fire", marca: "Hawas", mililitros: 100, precio: 39900, destacado: true },
  { slug: "hawas-for-him", nombre: "Hawas For Him", marca: "Hawas", mililitros: 100, precio: 39900 },
  { slug: "hawas-tropical", nombre: "Hawas Tropical", marca: "Hawas", mililitros: 100, precio: 45900 },
  { slug: "hawas-ice", nombre: "Hawas Ice", marca: "Hawas", mililitros: 100, precio: 39900 },

  // ----------------------------------------------------------------- Asad ---
  { slug: "asad-bourdon", nombre: "Asad Bourdon", marca: "Asad", mililitros: 100, precio: 36900 },
  { slug: "asad-bourdon-50ml", nombre: "Asad Bourdon", marca: "Asad", mililitros: 50, precio: 25900 },
  { slug: "asad-edp", nombre: "Asad EDP", marca: "Asad", mililitros: 100, precio: 36900 },

  // ----------------------------------------------------------------- Yara ---
  { slug: "yara-edp", nombre: "Yara EDP", marca: "Yara", mililitros: 50, precio: 25900, destacado: true },
  { slug: "yara-candy", nombre: "Yara Candy", marca: "Yara", mililitros: 100, precio: 36900 },
  { slug: "yara-elixir", nombre: "Yara Elixir", marca: "Yara", mililitros: 50, precio: 25900 },
  // Venía rotulado "Yata Tous" en el stock (typo): el frasco dice "Yara Tous".
  { slug: "yara-tous", nombre: "Yara Tous", marca: "Yara", mililitros: 100, precio: 36900 },

  // --------------------------------------------------------------- Fakhar ---
  { slug: "fakhar-rose", nombre: "Fakhar Rose", marca: "Fakhar", mililitros: 50, precio: 25900, categoria: "Floral" },
  { slug: "fakhar-black", nombre: "Fakhar Black", marca: "Fakhar", mililitros: 100, precio: 49900 },
  { slug: "fakhar-gold", nombre: "Fakhar Gold", marca: "Fakhar", mililitros: 100, precio: 49900 },

  // --------------------------------------------------------- Club de Nuit ---
  { slug: "club-de-nuit-urban-man-elixir", nombre: "Club de Nuit Urban Man Elixir", marca: "Club de Nuit", mililitros: 100, precio: 51900 },
  { slug: "club-de-nuit-untold", nombre: "Club de Nuit Untold", marca: "Club de Nuit", mililitros: 100, precio: 51900 },

  // -------------------------------------------------------------- Khamrah ---
  { slug: "khamrah-qahwa", nombre: "Khamrah Qahwa", marca: "Khamrah", mililitros: 50, precio: 25900, categoria: "Oud & Ámbar" },
  { slug: "khamrah-waha", nombre: "Khamrah Waha", marca: "Khamrah", mililitros: 100, precio: 52900, categoria: "Oud & Ámbar", destacado: true },

  // ------------------------------------------------------------------ 9PM ---
  { slug: "9pm-edp", nombre: "9PM EDP", marca: "9PM", mililitros: 100, precio: 47900 },
  { slug: "9pm-elixir", nombre: "9PM Elixir", marca: "9PM", mililitros: 100, precio: 50900 },
  { slug: "9pm-rebel", nombre: "9PM Rebel", marca: "9PM", mililitros: 100, precio: 50900 },
  // "9AM" es la misma casa/línea que 9PM (confirmado por el dueño). Nombre
  // propio conservado; el slug queda "9am" (no colisiona con los "9pm-*").
  { slug: "9am", nombre: "9AM", marca: "9PM", mililitros: 100, precio: 47900 },

  // ------------------------------------------------------------ Erba Pura ---
  { slug: "erba-pura", nombre: "Erba Pura", marca: "Erba Pura", mililitros: 50, precio: 32900 },
  { slug: "erba-pura-con-panuelo", nombre: "Erba Pura Con Pañuelo", marca: "Erba Pura", mililitros: 100, precio: 105900, original: true },
  { slug: "erba-pura-liso", nombre: "Erba Pura Liso", marca: "Erba Pura", mililitros: 100, precio: 52900 },

  // ------------------------------------------------------------- Mandarin ---
  { slug: "mandarin-sky-vintage", nombre: "Mandarin Sky Vintage", marca: "Mandarin", mililitros: 100, precio: 45900, categoria: "Fresco / Cítrico" },
  { slug: "mandarin-sky", nombre: "Mandarin Sky", marca: "Mandarin", mililitros: 100, precio: 45900, categoria: "Fresco / Cítrico" },

  // -------------------------------------------------------------- Eclaire ---
  { slug: "eclaire", nombre: "Eclaire", marca: "Eclaire", mililitros: 100, precio: 46900 },
  { slug: "eclaire-50ml", nombre: "Eclaire", marca: "Eclaire", mililitros: 50, precio: 25900 },

  // --------------------------------- Sueltos (sin línea con varios SKUs) ---
  { slug: "oud-for-glory", nombre: "Oud For Glory", marca: MARCA_OTRAS, mililitros: 100, precio: 48900 },
  { slug: "her-confesion", nombre: "Her Confesión", marca: MARCA_OTRAS, mililitros: 100, precio: 56900 },
  { slug: "angham-second-song", nombre: "Angham Second Song", marca: MARCA_OTRAS, mililitros: 100, precio: 51900 },
  { slug: "la-vida-es-bella", nombre: "La Vida Es Bella", marca: MARCA_OTRAS, mililitros: 75, precio: 25900 },
  { slug: "sublime", nombre: "Sublime", marca: MARCA_OTRAS, mililitros: 100, precio: 48900 },
  { slug: "invictus-legend", nombre: "Invictus Legend", marca: MARCA_OTRAS, mililitros: 100, precio: 30900 },
  { slug: "haramain-amber-oud", nombre: "Haramain Amber Oud", marca: MARCA_OTRAS, mililitros: 60, precio: 54900, categoria: "Oud & Ámbar" },
  { slug: "jpg-elixir", nombre: "JPG Elixir", marca: MARCA_OTRAS, mililitros: 100, precio: 49900 },
  { slug: "la-bomba", nombre: "La Bomba", marca: MARCA_OTRAS, mililitros: 80, precio: 45900 },
  { slug: "cotton-candy", nombre: "Cotton Candy", marca: MARCA_OTRAS, mililitros: 100, precio: 39900 },
  { slug: "noble-blush", nombre: "Noble Blush", marca: MARCA_OTRAS, mililitros: 100, precio: 48900 },
  { slug: "odyssey-marshmallow", nombre: "Odyssey Marshmallow", marca: MARCA_OTRAS, mililitros: 100, precio: 45900 },
  { slug: "gourmand-on-top-berry-edp", nombre: "Gourmand On Top Berry EDP", marca: MARCA_OTRAS, mililitros: 100, precio: 49900 },
  { slug: "minis-de-regalo", nombre: "Minis De Regalo", marca: MARCA_OTRAS, mililitros: 30, precio: 17900 },
  { slug: "candy", nombre: "Candy", marca: MARCA_OTRAS, mililitros: 100, precio: 29900 },
  { slug: "honor-and-glory", nombre: "Honor And Glory", marca: MARCA_OTRAS, mililitros: 100, precio: 48900 },
  { slug: "212-sexy-men", nombre: "212 Sexy Men", marca: MARCA_OTRAS, mililitros: 100, precio: 21900 },
]);

// Marcas presentes en el catálogo: alfabéticas, con MARCA_OTRAS siempre última.
// El orden es estable y no depende de los filtros activos: `fondoDeMarca` lo usa
// para darle a cada marca siempre el mismo tono.
export const MARCAS: Marca[] = (() => {
  const unicas = Array.from(new Set(productos.map((p) => p.marca)));
  const reales = unicas
    .filter((m) => m !== MARCA_OTRAS)
    .sort((a, b) => a.localeCompare(b, "es"));
  return unicas.includes(MARCA_OTRAS) ? [...reales, MARCA_OTRAS] : reales;
})();

export function getProductoPorSlug(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);
}
