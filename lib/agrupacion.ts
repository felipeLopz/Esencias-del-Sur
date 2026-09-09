import { MARCAS, type Marca, type Producto } from "@/data/productos";

// ============================================================================
// JERARQUÍA DE AGRUPACIÓN: TAMAÑO → MARCA
// ----------------------------------------------------------------------------
// Primer nivel: bucket de tamaño calculado desde `mililitros` (el enum cerrado
// `Formato` ya no existe: el stock real no calzaba en tres valores fijos).
// Segundo nivel: marca, en el orden canónico de MARCAS.
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

// Marcas con al menos un producto en la lista, en el orden canónico de MARCAS.
// Se usa para no renderizar sub-secciones marca+tamaño vacías.
export function marcasConProductos(productos: Producto[]): Marca[] {
  return MARCAS.filter((m) => productos.some((p) => p.marca === m));
}

export function contarPorTamano(productos: Producto[], tamano: Tamano): number {
  return filtrarPorTamano(productos, tamano).length;
}

// ============================================================================
// FONDO POR MARCA
// ----------------------------------------------------------------------------
// Antes era un Record hardcodeado de 5 marcas. Con ~20 marcas reales pasa a ser
// determinístico: se cicla por el índice de la marca en MARCAS (orden estable,
// alfabético, independiente de los filtros activos). Consecuencias:
//   - cada marca tiene SIEMPRE el mismo tono, filtre lo que filtre el usuario;
//   - dos marcas consecutivas nunca comparten tono;
//   - no hay que listar marcas nuevas a mano.
// El orden arranca en azul-osc para contrastar con la banda azul-negro que
// TamanoSection pone arriba de la primera marca.
// ============================================================================

const TONOS_MARCA = ["bg-azul-osc", "bg-azul-med", "bg-azul-negro"] as const;

export function fondoDeMarca(marca: Marca): string {
  const i = MARCAS.indexOf(marca);
  return TONOS_MARCA[(i < 0 ? 0 : i) % TONOS_MARCA.length];
}
