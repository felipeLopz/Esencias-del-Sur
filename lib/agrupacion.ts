import {
  MARCAS,
  type Formato,
  type Marca,
  type Producto,
} from "@/data/productos";

// ============================================================================
// JERARQUÍA DE AGRUPACIÓN: TAMAÑO → MARCA
// ----------------------------------------------------------------------------
// Primer nivel: "grande" (grande_50ml + grande_100ml) y "chico" (tubo_35ml).
// Segundo nivel: marca, en el orden canónico de MARCAS.
// `formato` sigue siendo el dato crudo del producto; "tamaño" es la agrupación
// derivada que usan la Home y /catalogo.
// ============================================================================

export type Tamano = "grande" | "chico";

export const TAMANOS: Tamano[] = ["grande", "chico"];

export const FORMATOS_POR_TAMANO: Record<Tamano, Formato[]> = {
  grande: ["grande_50ml", "grande_100ml"],
  chico: ["tubo_35ml"],
};

export const TAMANO_LABEL: Record<Tamano, string> = {
  grande: "Perfumes grandes",
  chico: "Perfumes chicos",
};

export const TAMANO_DETALLE: Record<Tamano, string> = {
  grande: "Frascos de 50 ml y 100 ml",
  chico: "Formato tubo de 35 ml",
};

export function tamanoDe(producto: Producto): Tamano {
  return producto.formato === "tubo_35ml" ? "chico" : "grande";
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
