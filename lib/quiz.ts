import { productos, type Producto, type Categoria } from "@/data/productos";

// ============================================================================
// LÓGICA DE PUNTAJE DEL QUIZ DE RECOMENDACIÓN
// ----------------------------------------------------------------------------
// Dos etapas, en este orden:
//   1. FILTROS DUROS (descartan): presupuesto y género. Lo que no los cumple
//      no puede aparecer nunca, aunque puntúe altísimo en todo lo demás.
//   2. PUNTAJE (ordena): aroma, género exacto vs unisex, "para regalar" y
//      ocasión, sobre los que ya pasaron el filtro.
// Devuelve hasta 3 productos; si califican menos, devuelve menos.
// ============================================================================

export interface RespuestasQuiz {
  genero: "hombre" | "mujer" | "no_importa";
  paraQuien: "mi" | "regalo";
  aroma: "dulce" | "fresco" | "amaderado" | "floral" | "sorprendeme";
  ocasion: "diario" | "noche";
  presupuesto: "hasta30" | "30a50" | "mas50";
}

// -------------------------------------------------------------- constantes ---

// Familias de aroma que sí tienen una `categoria` exacta hoy en productos.ts.
// "dulce" no tiene equivalente (no existe categoria "Gourmand" todavía), así
// que para esa familia siempre se recurre a las keywords en `descripcion`.
const AROMA_A_CATEGORIA: Partial<Record<RespuestasQuiz["aroma"], Categoria>> = {
  fresco: "Fresco / Cítrico",
  amaderado: "Oud & Ámbar",
  floral: "Floral",
};

// Keywords de fallback por familia, buscadas en `descripcion` cuando el
// producto no tiene `categoria` asignada (o cuando la familia es "dulce",
// que no tiene categoria exacta). Sin acentos: se comparan ya normalizadas.
const KEYWORDS_POR_AROMA: Record<
  Exclude<RespuestasQuiz["aroma"], "sorprendeme">,
  string[]
> = {
  dulce: ["vainilla", "cafe", "gourmand", "caramelo", "azucar", "dulce"],
  fresco: ["citrico", "bergamota", "limon", "acuatico", "fresco", "marino"],
  amaderado: ["oud", "ambar", "madera", "incienso", "especiad", "oriental"],
  floral: ["floral", "rosa", "jazmin", "flor"],
};

const KEYWORDS_OCASION_NOCHE = ["noche", "intenso", "seductor", "elegante"];

// "pimienta rosa" (pink pepper) es una especia, no una nota floral: si se
// buscara la keyword suelta "rosa" ahí adentro, matchearía por error contra
// la familia "floral". Se recorta esa frase puntual antes de buscar keywords
// (no afecta a las demás familias: ninguna otra keyword usa "pimienta" ni
// "rosa"). Repasadas dulce/fresco/amaderado no se encontró un riesgo similar
// de substring-en-frase-de-otro-significado.
const FRASE_PIMIENTA_ROSA = /pimienta\s+rosa/g;

// TECHO de gasto por opción de presupuesto. Es un techo, NO una banda: la
// opción elegida dice cuánto está dispuesto a gastar el usuario, así que un
// producto más barato siempre califica. Antes esto era un rango {min, max} y
// el piso descartaba, por ejemplo, un frasco de $19.900 cuando se elegía
// "$30.000 - $50.000", que es justo al revés de lo que espera el usuario.
//
// `mas50` no tiene techo: cualquier precio califica.
const TECHO_PRESUPUESTO: Record<RespuestasQuiz["presupuesto"], number> = {
  hasta30: 30000,
  "30a50": 49999,
  mas50: Infinity,
};

const MILILITROS_REGALO_MIN = 60;

// ----------------------------------------------------------------- helpers ---

// Saca acentos y pasa a minúsculas para comparar sin importar tildes/mayúsculas.
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function contieneAlguna(texto: string | undefined, keywords: string[]): boolean {
  if (!texto) return false;
  const textoNormalizado = normalizar(texto).replace(FRASE_PIMIENTA_ROSA, "");
  return keywords.some((kw) => textoNormalizado.includes(normalizar(kw)));
}

// ------------------------------------------------------- puntaje por criterio ---

function puntajeAroma(producto: Producto, aroma: RespuestasQuiz["aroma"]): number {
  if (aroma === "sorprendeme") return 0;

  const categoriaEsperada = AROMA_A_CATEGORIA[aroma];

  // Si la familia tiene categoria exacta (fresco/amaderado/floral) y el
  // producto la tiene asignada, se evalúa SOLO por categoria (match o no).
  if (categoriaEsperada && producto.categoria) {
    return producto.categoria === categoriaEsperada ? 3 : 0;
  }

  // Sin categoria asignada, o familia "dulce" (sin categoria posible):
  // se recurre a las keywords de la descripción.
  return contieneAlguna(producto.descripcion, KEYWORDS_POR_AROMA[aroma]) ? 1.5 : 0;
}

/**
 * El presupuesto ya NO puntúa: es un filtro duro que se aplica antes de
 * puntuar (ver `entraEnPresupuesto` / `recomendarProductos`). Como peso del
 * puntaje valía 2 sobre 8.5, y un match exacto de categoría (3) alcanzaba
 * para tapar esa penalización: por eso se colaban productos de $114.900 en el
 * rango "hasta $30.000".
 */
function entraEnPresupuesto(
  precio: number,
  presupuesto: RespuestasQuiz["presupuesto"]
): boolean {
  return precio <= TECHO_PRESUPUESTO[presupuesto];
}

/**
 * Filtro duro de género: con "hombre" o "mujer" solo califican los productos
 * de ese género y los Unisex. Con "no_importa" no se filtra nada. Antes esto
 * era solo puntaje (0 para el género opuesto) y no descartaba: pedir "Hombre"
 * con aroma floral devolvía Fakhar Rose y Eclaire, ambos de Mujer.
 */
function calzaElGenero(producto: Producto, genero: RespuestasQuiz["genero"]): boolean {
  if (genero === "no_importa") return true;
  if (producto.genero === "Unisex") return true;
  return producto.genero === (genero === "hombre" ? "Hombre" : "Mujer");
}

// El puntaje de género sigue existiendo para ordenar lo que YA pasó el filtro:
// un match exacto pesa más que un Unisex.
function puntajeGenero(producto: Producto, genero: RespuestasQuiz["genero"]): number {
  if (genero === "no_importa") return 0;

  const generoElegido = genero === "hombre" ? "Hombre" : "Mujer";
  if (producto.genero === generoElegido) return 2;
  if (producto.genero === "Unisex") return 1;
  return 0; // género opuesto: hoy lo descarta `calzaElGenero` antes de puntuar
}

function puntajeRegalo(producto: Producto, paraQuien: RespuestasQuiz["paraQuien"]): number {
  if (paraQuien !== "regalo") return 0;
  const esSetRegalo = producto.categoria === "Sets regalo";
  const esGrande = producto.mililitros >= MILILITROS_REGALO_MIN;
  return esSetRegalo || esGrande ? 1 : 0;
}

function puntajeOcasion(producto: Producto, ocasion: RespuestasQuiz["ocasion"]): number {
  if (ocasion !== "noche") return 0;
  return contieneAlguna(producto.descripcion, KEYWORDS_OCASION_NOCHE) ? 0.5 : 0;
}

// ------------------------------------------------------------------ público ---

/** Puntaje total de un producto para una respuesta de quiz dada. Exportado
 * aparte de `recomendarProductos` para poder inspeccionarlo/testearlo. */
export function calcularPuntaje(producto: Producto, respuestas: RespuestasQuiz): number {
  return (
    puntajeGenero(producto, respuestas.genero) +
    puntajeAroma(producto, respuestas.aroma) +
    puntajeRegalo(producto, respuestas.paraQuien) +
    puntajeOcasion(producto, respuestas.ocasion)
  );
}

/**
 * Productos que CALIFICAN para las respuestas dadas: presupuesto y género son
 * filtros duros, no pesos del puntaje. Puede devolver una lista vacía.
 */
export function productosQueCalifican(respuestas: RespuestasQuiz): Producto[] {
  return productos.filter(
    (p) =>
      entraEnPresupuesto(p.precio, respuestas.presupuesto) &&
      calzaElGenero(p, respuestas.genero)
  );
}

/**
 * Hasta 3 productos recomendados, siempre dentro del presupuesto y del género
 * elegidos. Si califican menos de 3, devuelve los que haya (incluso ninguno):
 * NO se rellena con productos que no cumplan los filtros.
 * Los empates de puntaje se desempatan por precio: gana el más BARATO en los
 * rangos con techo, y el más CARO en el rango sin techo ("más de $50.000"),
 * donde quien elige suele buscar algo premium.
 */
export function recomendarProductos(respuestas: RespuestasQuiz): Producto[] {
  const sinTecho = TECHO_PRESUPUESTO[respuestas.presupuesto] === Infinity;
  return productosQueCalifican(respuestas)
    .sort((a, b) => {
      const puntajeA = calcularPuntaje(a, respuestas);
      const puntajeB = calcularPuntaje(b, respuestas);
      if (puntajeB !== puntajeA) return puntajeB - puntajeA;
      return sinTecho ? b.precio - a.precio : a.precio - b.precio;
    })
    .slice(0, 3);
}
