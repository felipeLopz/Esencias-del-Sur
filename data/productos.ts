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
  { slug: "hawas-viper", nombre: "Hawas Viper", marca: "Hawas", mililitros: 100, precio: 39900, descripcion: "Oriental especiado para hombre: azafrán, tabaco y café sobre una base de musgo, almizcle y tonka. Intenso, pensado para la noche." },
  { slug: "hawas-pink", nombre: "Hawas Pink", marca: "Hawas", mililitros: 100, precio: 39900, descripcion: "Oriental vainillado para mujer: canela y neroli dan paso a tuberosa y azahar, sobre una base golosa de algodón de azúcar, vainilla y tonka." },
  { slug: "hawas-fire", nombre: "Hawas Fire", marca: "Hawas", mililitros: 100, precio: 39900, destacado: true, descripcion: "Composición frutal y ahumada, con una salida cítrica y floral sobre un fondo amaderado. Audaz e intensa, para quien busca destacar." },
  { slug: "hawas-for-him", nombre: "Hawas For Him", marca: "Hawas", mililitros: 100, precio: 39900, descripcion: "Amaderado acuático para hombre: canela, bergamota y azahar sobre ámbar gris y sándalo. Versátil, pensado para el uso diario." },
  { slug: "hawas-tropical", nombre: "Hawas Tropical", marca: "Hawas", mililitros: 100, precio: 45900, descripcion: "Aromática y verde: agua de coco, higo y jengibre en la apertura, con sándalo, haba tonka y almizcle de fondo. Ideal para el verano." },
  { slug: "hawas-ice", nombre: "Hawas Ice", marca: "Hawas", mililitros: 100, precio: 39900, descripcion: "Fresca y especiada: manzana, limón y bergamota se abren paso a ciruela y azahar, cerrando en almizcle, ámbar y maderas húmedas." },

  // ----------------------------------------------------------------- Asad ---
  { slug: "asad-bourdon", nombre: "Asad Bourdon", marca: "Asad", mililitros: 100, precio: 36900, descripcion: "Variante de la línea Asad, de perfil oriental y amaderado. Ideal para uso diario o de noche." },
  { slug: "asad-bourdon-50ml", nombre: "Asad Bourdon", marca: "Asad", mililitros: 50, precio: 25900, descripcion: "Variante de la línea Asad, de perfil oriental y amaderado. Ideal para uso diario o de noche." },
  { slug: "asad-edp", nombre: "Asad EDP", marca: "Asad", mililitros: 100, precio: 36900, descripcion: "Oriental para hombre: pimienta negra, tabaco y piña en la apertura, corazón de pachulí y café, y fondo de vainilla, ámbar y maderas secas." },

  // ----------------------------------------------------------------- Yara ---
  { slug: "yara-edp", nombre: "Yara EDP", marca: "Yara", mililitros: 50, precio: 25900, destacado: true, descripcion: "Floral gourmand inspirada en los grandes clásicos franceses: iris y pachulí sobre una base dulce de vainilla y praliné. Femenina y elegante." },
  { slug: "yara-candy", nombre: "Yara Candy", marca: "Yara", mililitros: 100, precio: 36900, categoria: "Floral", descripcion: "Floral frutal gourmand: grosella negra y mandarina en la salida, caramelo de frutilla y gardenia en el corazón, vainilla, almizcle y sándalo de fondo." },
  { slug: "yara-elixir", nombre: "Yara Elixir", marca: "Yara", mililitros: 50, precio: 25900, descripcion: "Oriental vainillado: s'mores de frutilla y grosella negra se funden con jazmín y azahar. Cálida y golosa, ideal para el invierno." },
  // Venía rotulado "Yata Tous" en el stock (typo): el frasco dice "Yara Tous".
  { slug: "yara-tous", nombre: "Yara Tous", marca: "Yara", mililitros: 100, precio: 36900, descripcion: "Frutal floral: mango, coco y maracuyá se abren a jazmín, azahar y heliotropo, cerrando en vainilla, almizcle y cashmeran." },

  // --------------------------------------------------------------- Fakhar ---
  { slug: "fakhar-rose", nombre: "Fakhar Rose", marca: "Fakhar", mililitros: 50, precio: 25900, categoria: "Floral", descripcion: "Floral fresca y femenina, con la rosa como protagonista sobre un fondo suave y almizclado. Ideal para el día." },
  { slug: "fakhar-black", nombre: "Fakhar Black", marca: "Fakhar", mililitros: 100, precio: 49900, descripcion: "Oriental para hombre: manzana, bergamota y jengibre se abren a lavanda, salvia y enebro, cerrando en tonka, cedro y vetiver." },
  { slug: "fakhar-gold", nombre: "Fakhar Gold", marca: "Fakhar", mililitros: 100, precio: 49900, descripcion: "Oriental amaderado unisex: tuberosa y sal marina en la apertura, ámbar, cashmeran y tonka en el corazón, cedro, vetiver y labdanum de fondo." },

  // --------------------------------------------------------- Club de Nuit ---
  { slug: "club-de-nuit-urban-man-elixir", nombre: "Club de Nuit Urban Man Elixir", marca: "Club de Nuit", mililitros: 100, precio: 51900, descripcion: "Amaderado aromático para hombre: bergamota, pimienta rosa y azahar sobre lavanda y vetiver, con una base de ámbar, cedro y pachulí." },
  { slug: "club-de-nuit-untold", nombre: "Club de Nuit Untold", marca: "Club de Nuit", mililitros: 100, precio: 51900, descripcion: "Ambarado y amaderado: azafrán y jazmín en la apertura, sobre un fondo resinoso de cedro. Elegante y envolvente." },

  // -------------------------------------------------------------- Khamrah ---
  { slug: "khamrah-qahwa", nombre: "Khamrah Qahwa", marca: "Khamrah", mililitros: 50, precio: 25900, descripcion: "Oriental gourmand: canela, cardamomo y jengibre dan paso a praliné y frutos confitados, cerrando en café, vainilla y tonka. Cálida, para el invierno." },
  { slug: "khamrah-waha", nombre: "Khamrah Waha", marca: "Khamrah", mililitros: 100, precio: 52900, categoria: "Fresco / Cítrico", destacado: true, descripcion: "Fresca y acuática: bergamota, yuzu y jengibre se abren a pepino, sal marina e iris, con vainilla, almizcle y maderas de fondo." },

  // ------------------------------------------------------------------ 9PM ---
  { slug: "9pm-edp", nombre: "9PM EDP", marca: "9PM", mililitros: 100, precio: 47900, descripcion: "Oriental vainillado para hombre: manzana, canela y lavanda en la apertura, azahar y lirio de los valles en el corazón, vainilla y tonka de fondo." },
  { slug: "9pm-elixir", nombre: "9PM Elixir", marca: "9PM", mililitros: 100, precio: 50900, descripcion: "Especiado e intenso: nuez moscada, cardamomo y pimienta se funden con cuero, labdanum, pachulí y vainilla. Cálido, ideal para el invierno." },
  { slug: "9pm-rebel", nombre: "9PM Rebel", marca: "9PM", mililitros: 100, precio: 50900, descripcion: "Frutal amaderado: mandarina, piña y manzana verde sobre cedro y musgo de roble, con caramelo y almizcle de fondo." },
  // "9AM" es la misma casa/línea que 9PM (confirmado por el dueño). Nombre
  // propio conservado; el slug queda "9am" (no colisiona con los "9pm-*").
  { slug: "9am", nombre: "9AM", marca: "9PM", mililitros: 100, precio: 47900, descripcion: "Fresca y floral: limón, mandarina y cardamomo se abren a lavanda, azahar y rosa, cerrando en almizcle, musgo, cedro y pachulí. Ideal para el día." },

  // ------------------------------------------------------------ Erba Pura ---
  { slug: "erba-pura", nombre: "Erba Pura", marca: "Erba Pura", mililitros: 50, precio: 32900, categoria: "Oud & Ámbar", descripcion: "Ámbar cítrico: naranja siciliana, bergamota y limón en la apertura, notas frutales dulces en el corazón, y un fondo de almizcle blanco, vainilla y ámbar." },
  { slug: "erba-pura-con-panuelo", nombre: "Erba Pura Con Pañuelo", marca: "Erba Pura", mililitros: 100, precio: 105900, original: true, categoria: "Oud & Ámbar", descripcion: "La misma fragancia ámbar cítrica de la línea Erba Pura —naranja siciliana, bergamota y un fondo de vainilla y ámbar— en edición con pañuelo de seda incluido." },
  { slug: "erba-pura-liso", nombre: "Erba Pura Liso", marca: "Erba Pura", mililitros: 100, precio: 52900, categoria: "Oud & Ámbar", descripcion: "Ámbar cítrico: naranja siciliana, bergamota y limón en la apertura, notas frutales dulces en el corazón, y un fondo de almizcle blanco, vainilla y ámbar." },

  // ------------------------------------------------------------- Mandarin ---
  { slug: "mandarin-sky-vintage", nombre: "Mandarin Sky Vintage", marca: "Mandarin", mililitros: 100, precio: 45900, categoria: "Fresco / Cítrico", descripcion: "Edición vintage de Mandarin Sky: mandarina, naranja, azafrán y salvia en la apertura, caramelo y tonka en el corazón, ambroxan, cedro y vetiver de fondo." },
  { slug: "mandarin-sky", nombre: "Mandarin Sky", marca: "Mandarin", mililitros: 100, precio: 45900, categoria: "Fresco / Cítrico", descripcion: "Fresca y cítrica: mandarina, naranja, azafrán y salvia en la apertura, caramelo y tonka en el corazón, ambroxan, cedro y vetiver de fondo." },

  // -------------------------------------------------------------- Eclaire ---
  { slug: "eclaire", nombre: "Eclaire", marca: "Eclaire", mililitros: 100, precio: 46900, categoria: "Floral", descripcion: "Floral frutal gourmand: caramelo, leche y azúcar en la apertura, miel y flores blancas en el corazón, vainilla, praliné y almizcle de fondo. Dulce y envolvente." },
  { slug: "eclaire-50ml", nombre: "Eclaire", marca: "Eclaire", mililitros: 50, precio: 25900, categoria: "Floral", descripcion: "Floral frutal gourmand: caramelo, leche y azúcar en la apertura, miel y flores blancas en el corazón, vainilla, praliné y almizcle de fondo. Dulce y envolvente." },

  // --------------------------------- Sueltos (sin línea con varios SKUs) ---
  { slug: "oud-for-glory", nombre: "Oud For Glory", marca: MARCA_OTRAS, mililitros: 100, precio: 48900, categoria: "Oud & Ámbar", descripcion: "Oriental amaderado con oud como protagonista: azafrán, nuez moscada y lavanda en la apertura, agarwood y pachulí en el corazón y el fondo. Intensa y de larga duración." },
  { slug: "her-confesion", nombre: "Her Confesión", marca: MARCA_OTRAS, mililitros: 100, precio: 56900, descripcion: "Floral oriental para mujer: canela y un acorde místico dan paso a jazmín, tuberosa e incienso, cerrando en haba tonka, almizcle y vainilla." },
  { slug: "angham-second-song", nombre: "Angham Second Song", marca: MARCA_OTRAS, mililitros: 100, precio: 51900, categoria: "Floral", descripcion: "Floral con carácter, pensada para mujer: flores blancas sobre un fondo suave y almizclado. Elegante y versátil para el día a día." },
  { slug: "la-vida-es-bella", nombre: "La Vida Es Bella", marca: MARCA_OTRAS, mililitros: 75, precio: 25900, categoria: "Floral", descripcion: "Floral gourmand inspirada en los grandes íconos franceses: iris y pachulí sobre una base dulce de vainilla y praliné. Femenina y sofisticada." },
  { slug: "sublime", nombre: "Sublime", marca: MARCA_OTRAS, mililitros: 100, precio: 48900, descripcion: "Floral frutal gourmand: manzana, lichi y ciruela se abren a rosa y jazmín, cerrando en vainilla, musgo y pachulí. Dulce y femenina." },
  { slug: "invictus-legend", nombre: "Invictus Legend", marca: MARCA_OTRAS, mililitros: 100, precio: 30900, categoria: "Fresco / Cítrico", descripcion: "Fresca y marina: sal marina, pomelo y notas de mar en la apertura, especias y geranio en el corazón, madera de guayaco y ámbar rojo de fondo. Ideal para el día." },
  { slug: "haramain-amber-oud", nombre: "Haramain Amber Oud", marca: MARCA_OTRAS, mililitros: 60, precio: 54900, categoria: "Oud & Ámbar", descripcion: "Oriental amaderado intenso, con oud y ámbar como eje central. Cálida y de gran proyección, pensada para el frío." },
  { slug: "jpg-elixir", nombre: "JPG Elixir", marca: MARCA_OTRAS, mililitros: 100, precio: 49900, descripcion: "Oriental gourmand para hombre: lavanda y menta frescas se funden con vainilla, benjuí, miel, tonka y tabaco. Dulce e intensa, ideal para la noche." },
  { slug: "la-bomba", nombre: "La Bomba", marca: MARCA_OTRAS, mililitros: 80, precio: 45900, categoria: "Floral", descripcion: "Floral frutal: pitahaya, ananá y mandarina en la apertura, frangipani, peonía roja y jazmín en el corazón, vainilla, pachulí y tonka de fondo. Alegre y luminosa." },
  { slug: "cotton-candy", nombre: "Cotton Candy", marca: MARCA_OTRAS, mililitros: 100, precio: 39900, categoria: "Floral", descripcion: "Floral frutal gourmand: frambuesa y pimienta rosa en la apertura, jazmín y rosa en el corazón, vainilla, benjuí y cedro de fondo. Dulce y golosa." },
  { slug: "noble-blush", nombre: "Noble Blush", marca: MARCA_OTRAS, mililitros: 100, precio: 48900, categoria: "Floral", descripcion: "Floral frutal gourmand: leche de rosas y merengue de almendra sobre una base de vainilla, sándalo y almizcle. Delicada y golosa." },
  { slug: "odyssey-marshmallow", nombre: "Odyssey Marshmallow", marca: MARCA_OTRAS, mililitros: 100, precio: 45900, categoria: "Floral", descripcion: "Floral frutal gourmand: coco, manzana y peonía en la apertura, malvavisco, frutilla y azahar en el corazón, vainilla, praliné y ámbar de fondo. Muy dulce y envolvente." },
  { slug: "gourmand-on-top-berry-edp", nombre: "Gourmand On Top Berry EDP", marca: MARCA_OTRAS, mililitros: 100, precio: 49900, descripcion: "Gourmand frutal: frutilla y crema chantilly en la apertura, mermelada de frutilla y flores blancas en el corazón, vainilla y almizcle de fondo. Dulce, ideal para el día." },
  { slug: "minis-de-regalo", nombre: "Minis De Regalo", marca: MARCA_OTRAS, mililitros: 30, precio: 17900, categoria: "Sets regalo", descripcion: "Estuche de descubrimiento con miniaturas de varias de nuestras líneas. Ideal para probar distintos perfiles o para regalar." },
  { slug: "candy", nombre: "Candy", marca: MARCA_OTRAS, mililitros: 100, precio: 29900, descripcion: "Fragancia dulce y golosa de la línea Candy, ideal para quienes buscan un perfil gourmand fácil de llevar a diario." },
  { slug: "honor-and-glory", nombre: "Honor And Glory", marca: MARCA_OTRAS, mililitros: 100, precio: 48900, descripcion: "Oriental especiado: ananá y crème brûlée en la apertura, canela, cúrcuma y pimienta negra en el corazón, vainilla, sándalo, cashmeran y musgo de fondo." },
  { slug: "212-sexy-men", nombre: "212 Sexy Men", marca: MARCA_OTRAS, mililitros: 100, precio: 21900, descripcion: "Oriental fougère clásico: mandarina y bergamota en la apertura, pimienta y flores en el corazón, vainilla, madera de guayaco, sándalo y ámbar de fondo." },
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
