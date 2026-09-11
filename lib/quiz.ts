import { productos, type Producto, type Categoria } from "@/data/productos";

// ============================================================================
// LÓGICA DE PUNTAJE DEL QUIZ DE RECOMENDACIÓN
// ----------------------------------------------------------------------------
// Sin UI todavía: esto solo calcula, en base a las respuestas del quiz, los 3
// productos con mayor puntaje. Ver `recomendarProductos` para el criterio de
// puntaje completo (match de aroma, presupuesto, "para regalar" y ocasión).
// ============================================================================

export interface RespuestasQuiz {
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

// Rangos de precio por presupuesto. `mas50` no tiene techo.
const RANGOS_PRESUPUESTO: Record<
  RespuestasQuiz["presupuesto"],
  { min: number; max: number }
> = {
  hasta30: { min: 0, max: 30000 },
  "30a50": { min: 30000, max: 50000 },
  mas50: { min: 50000, max: Infinity },
};

const TOLERANCIA_PRESUPUESTO = 3000;

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

function puntajePresupuesto(
  precio: number,
  presupuesto: RespuestasQuiz["presupuesto"]
): number {
  const { min, max } = RANGOS_PRESUPUESTO[presupuesto];

  if (precio >= min && precio <= max) return 2;

  // Rango adyacente por abajo (con tolerancia).
  if (precio < min && precio >= min - TOLERANCIA_PRESUPUESTO) return 0.5;

  // Rango adyacente por arriba (con tolerancia). No aplica si el rango no
  // tiene techo (mas50).
  if (max !== Infinity && precio > max && precio <= max + TOLERANCIA_PRESUPUESTO) {
    return 0.5;
  }

  return 0;
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
    puntajeAroma(producto, respuestas.aroma) +
    puntajePresupuesto(producto.precio, respuestas.presupuesto) +
    puntajeRegalo(producto, respuestas.paraQuien) +
    puntajeOcasion(producto, respuestas.ocasion)
  );
}

/** Devuelve los 3 productos con mayor puntaje para las respuestas dadas.
 * Empates (incluido el del 3er puesto) se desempatan por mayor precio. */
export function recomendarProductos(respuestas: RespuestasQuiz): Producto[] {
  return [...productos]
    .sort((a, b) => {
      const puntajeA = calcularPuntaje(a, respuestas);
      const puntajeB = calcularPuntaje(b, respuestas);
      if (puntajeB !== puntajeA) return puntajeB - puntajeA;
      return b.precio - a.precio;
    })
    .slice(0, 3);
}
