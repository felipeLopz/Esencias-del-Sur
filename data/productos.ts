// ============================================================================
// DATOS DE PRODUCTOS — EJEMPLO
// ----------------------------------------------------------------------------
// Estos productos son de ejemplo, tomados de los mockups, solo para poder
// previsualizar el sitio. REEMPLAZAR por los productos reales de la marca
// (nombres, precios, tamaños, descripciones e imágenes definitivas).
//
// Las imágenes usan picsum.photos como placeholder: cambiar `imagen` por la
// ruta real (ej: "/productos/ambar-real.jpg" dentro de /public/productos).
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

export type Marca =
  | "9PM"
  | "Odyssey"
  | "Khamrah"
  | "Club de Nuit"
  | "Badee Al Oud";

export const MARCAS: Marca[] = [
  "9PM",
  "Odyssey",
  "Khamrah",
  "Club de Nuit",
  "Badee Al Oud",
];

export type Formato = "tubo_35ml" | "grande_50ml" | "grande_100ml";

export const FORMATOS: Formato[] = ["tubo_35ml", "grande_50ml", "grande_100ml"];

export interface Producto {
  id: number;
  slug: string;
  nombre: string;
  categoria: Categoria;
  marca: Marca;
  formato: Formato;
  tamano: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

export const productos: Producto[] = [
  {
    id: 1,
    slug: "ambar-real",
    nombre: "Ámbar Real",
    categoria: "Oud & Ámbar",
    marca: "Badee Al Oud",
    formato: "grande_50ml",
    tamano: "50 ml",
    precio: 68000,
    imagen: "https://picsum.photos/seed/ambar-real/700/900",
    descripcion:
      "Ámbar cálido y resinoso sobre un fondo de vainilla y benjuí. Una estela envolvente que evoca los salones de un palacio del desierto al caer la tarde.",
  },
  {
    id: 2,
    slug: "oud-dorado",
    nombre: "Oud Dorado",
    categoria: "Oud & Ámbar",
    marca: "Khamrah",
    formato: "grande_100ml",
    tamano: "50 ml",
    precio: 82000,
    imagen: "https://picsum.photos/seed/oud-dorado/700/900",
    descripcion:
      "Oud profundo y ahumado, redondeado con rosa de Taif y azafrán. Intenso, señorial y de larga permanencia.",
  },
  {
    id: 3,
    slug: "noche-arabe",
    nombre: "Noche Árabe",
    categoria: "Oud & Ámbar",
    marca: "Badee Al Oud",
    formato: "tubo_35ml",
    tamano: "75 ml",
    precio: 91000,
    imagen: "https://picsum.photos/seed/noche-arabe/700/900",
    descripcion:
      "Oud, incienso y pachulí con un corazón de ciruela y especias. Un aroma nocturno, misterioso y magnético.",
  },
  {
    id: 4,
    slug: "rosa-del-desierto",
    nombre: "Rosa del Desierto",
    categoria: "Floral",
    marca: "Odyssey",
    formato: "grande_50ml",
    tamano: "50 ml",
    precio: 64000,
    imagen: "https://picsum.photos/seed/rosa-del-desierto/700/900",
    descripcion:
      "Rosa damascena y peonía sobre un lecho de almizcle y madera de cachemira. Floral opulento con un toque aterciopelado.",
  },
  {
    id: 5,
    slug: "jazmin-de-damasco",
    nombre: "Jazmín de Damasco",
    categoria: "Floral",
    marca: "9PM",
    formato: "grande_50ml",
    tamano: "50 ml",
    precio: 66000,
    imagen: "https://picsum.photos/seed/jazmin-de-damasco/700/900",
    descripcion:
      "Jazmín sambac en plena floración, con nardo y un fondo cremoso de sándalo. Blanco, luminoso y adictivo.",
  },
  {
    id: 6,
    slug: "datil-y-sandalo",
    nombre: "Dátil & Sándalo",
    categoria: "Floral",
    marca: "Khamrah",
    formato: "grande_100ml",
    tamano: "75 ml",
    precio: 72000,
    imagen: "https://picsum.photos/seed/datil-y-sandalo/700/900",
    descripcion:
      "Dátil confitado y frutos secos sobre sándalo y haba tonka. Gourmand cálido con un alma amaderada.",
  },
  {
    id: 7,
    slug: "almizcle-blanco",
    nombre: "Almizcle Blanco",
    categoria: "Fresco / Cítrico",
    marca: "Club de Nuit",
    formato: "tubo_35ml",
    tamano: "50 ml",
    precio: 58000,
    imagen: "https://picsum.photos/seed/almizcle-blanco/700/900",
    descripcion:
      "Almizcle limpio y transparente con bergamota y notas de lino. Fresco, sutil y perfecto para el uso diario.",
  },
  {
    id: 8,
    slug: "citrico-real",
    nombre: "Cítrico Real",
    categoria: "Fresco / Cítrico",
    marca: "Club de Nuit",
    formato: "grande_100ml",
    tamano: "75 ml",
    precio: 61000,
    imagen: "https://picsum.photos/seed/citrico-real/700/900",
    descripcion:
      "Limón de Amalfi, mandarina y neroli sobre un fondo de cedro. Chispeante y elegante, con proyección luminosa.",
  },
  {
    id: 9,
    slug: "set-descubrimiento",
    nombre: "Set Descubrimiento",
    categoria: "Sets regalo",
    marca: "9PM",
    formato: "tubo_35ml",
    tamano: "5 × 8 ml",
    precio: 45000,
    imagen: "https://picsum.photos/seed/set-descubrimiento/700/900",
    descripcion:
      "Cinco de nuestras fragancias más queridas en formato viajero, presentadas en un estuche de regalo. La forma ideal de encontrar tu firma.",
  },
];

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
