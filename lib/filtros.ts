import {
  CATEGORIAS,
  GENEROS,
  MARCAS,
  productos,
  type Categoria,
  type Genero,
  type Marca,
  type Producto,
} from "@/data/productos";

// ============================================================================
// FILTROS DEL CATÁLOGO POR QUERY PARAM
// ----------------------------------------------------------------------------
// `?tamano=` vive en lib/agrupacion.ts (es parte de la jerarquía tamaño→marca).
// Acá van los filtros transversales que se aplican sobre la lista antes de
// agruparla: categoría, marca y "solo originales".
// Los usa /catalogo (CatalogoCompleto) y los generan los links de la Home.
// ============================================================================

export function esCategoria(valor: string | null | undefined): valor is Categoria {
  return !!valor && (CATEGORIAS as string[]).includes(valor);
}

export function esMarca(valor: string | null | undefined): valor is Marca {
  return !!valor && MARCAS.includes(valor);
}

export function esGenero(valor: string | null | undefined): valor is Genero {
  return !!valor && (GENEROS as string[]).includes(valor);
}

export interface FiltrosCatalogo {
  categoria?: Categoria;
  marca?: Marca;
  genero?: Genero;
  soloOriginales?: boolean;
}

export function aplicarFiltros(
  lista: Producto[],
  { categoria, marca, genero, soloOriginales }: FiltrosCatalogo
): Producto[] {
  return lista.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!marca || p.marca === marca) &&
      (!genero || p.genero === genero) &&
      (!soloOriginales || p.original === true)
  );
}

// ---------------------------------------------------------------- conteos ---
// Se calculan desde `productos`, no son números fijos.

export function contarPorCategoria(categoria: Categoria): number {
  return productos.filter((p) => p.categoria === categoria).length;
}

export function contarOriginales(): number {
  return productos.filter((p) => p.original === true).length;
}

export function contarTodos(): number {
  return productos.length;
}
