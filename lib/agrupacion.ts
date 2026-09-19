import {
  FABRICANTES,
  MARCAS,
  type Fabricante,
  type Marca,
  type Producto,
} from "@/data/productos";

// ============================================================================
// JERARQUÍA DE AGRUPACIÓN: FABRICANTE → MARCA/LÍNEA
// ----------------------------------------------------------------------------
// Primer nivel: fabricante real (Lattafa, Afnan, Armaf...), en el orden
// canónico de FABRICANTES (no alfabético, con "Otras marcas" siempre al final).
// Segundo nivel: marca/línea (Khamrah, Yara, Asad...), en el orden canónico de
// MARCAS.
//
// El tamaño (grande/chico) YA NO es un nivel de la jerarquía: pasó a ser un
// filtro transversal más, al lado de categoría y género (ver `?tamano=` abajo y
// FiltroTabs en CatalogoCompleto).
// ============================================================================

export type Tamano = "grande" | "chico";

export const TAMANOS: Tamano[] = ["grande", "chico"];

/**
 * Corte entre "chico" y "grande", en ml (inclusive del lado chico).
 * Con el stock actual: 30 y 50 ml caen en "chico"; 60, 75, 80 y 100 en "grande".
 */
export const ML_CORTE_CHICO = 50;

export const TAMANO_LABEL: Record<Tamano, string> = {
  grande: "Perfumes grandes",
  chico: "Perfumes chicos",
};

export const TAMANO_DETALLE: Record<Tamano, string> = {
  grande: "Frascos de 60 ml a 100 ml",
  chico: "Frascos de 30 ml y 50 ml",
};

/** Etiqueta legible del tamaño de un frasco: 100 -> "100 ml". */
export function tamanoLabel(mililitros: number): string {
  return `${mililitros} ml`;
}

export function tamanoDe(producto: Producto): Tamano {
  return producto.mililitros <= ML_CORTE_CHICO ? "chico" : "grande";
}

// Type guard para el query param `?tamano=`.
export function esTamano(valor: string | null | undefined): valor is Tamano {
  return valor === "grande" || valor === "chico";
}

export function filtrarPorTamano(
  productos: Producto[],
  tamano: Tamano
): Producto[] {
  return productos.filter((p) => tamanoDe(p) === tamano);
}

// Fabricantes con al menos un producto en la lista, en el orden canónico de
// FABRICANTES. Se usa para no renderizar bloques de fabricante vacíos.
export function fabricantesConProductos(productos: Producto[]): Fabricante[] {
  return FABRICANTES.filter((f) => productos.some((p) => p.fabricante === f));
}

// Marcas con al menos un producto en la lista, en el orden canónico de MARCAS.
// Se usa para no renderizar sub-secciones de marca vacías.
export function marcasConProductos(productos: Producto[]): Marca[] {
  return MARCAS.filter((m) => productos.some((p) => p.marca === m));
}

// Las líneas de un fabricante presentes en la lista, en el orden de MARCAS.
export function marcasDeFabricante(
  productos: Producto[],
  fabricante: Fabricante
): Marca[] {
  return marcasConProductos(
    productos.filter((p) => p.fabricante === fabricante)
  );
}

export function contarPorTamano(productos: Producto[], tamano: Tamano): number {
  return filtrarPorTamano(productos, tamano).length;
}

// ============================================================================
// FONDO POR FABRICANTE
// ----------------------------------------------------------------------------
// El tono se asigna a nivel FABRICANTE (antes era por marca): todas las líneas
// de un mismo fabricante comparten fondo, así el bloque se lee como una unidad.
// Es determinístico: se cicla por el índice del fabricante en FABRICANTES
// (orden estable, independiente de los filtros activos). Consecuencias:
//   - cada fabricante tiene SIEMPRE el mismo tono, filtre lo que filtre;
//   - dos fabricantes consecutivos nunca comparten tono;
//   - no hay que listar fabricantes nuevos a mano.
// Arranca en azul-osc para contrastar con la banda azul-negro de los filtros.
// ============================================================================

const TONOS_FABRICANTE = ["bg-azul-osc", "bg-azul-med", "bg-azul-negro"] as const;

export function fondoDeFabricante(fabricante: Fabricante): string {
  const i = FABRICANTES.indexOf(fabricante);
  return TONOS_FABRICANTE[(i < 0 ? 0 : i) % TONOS_FABRICANTE.length];
}
