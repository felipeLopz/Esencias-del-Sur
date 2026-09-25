import {
  CATEGORIAS,
  FABRICANTES,
  GENEROS,
  MARCAS,
  productos,
  type Categoria,
  type Fabricante,
  type Genero,
  type Marca,
  type Producto,
} from "@/data/productos";
import { esTamano, tamanoDe, type Tamano } from "@/lib/agrupacion";

// ============================================================================
// FILTROS DEL CATÁLOGO POR QUERY PARAM
// ----------------------------------------------------------------------------
// Todos los filtros transversales que se aplican sobre la lista antes de
// agruparla Fabricante → Marca: fabricante, categoría, marca, género, tamaño y
// "solo originales". El tamaño entró acá cuando dejó de ser un nivel de la
// jerarquía (los helpers `tamanoDe` / `esTamano` siguen en lib/agrupacion.ts).
// Los usa /catalogo (CatalogoCompleto) y los generan los links de la Home.
// ============================================================================

export function esCategoria(valor: string | null | undefined): valor is Categoria {
  return !!valor && (CATEGORIAS as string[]).includes(valor);
}

export function esMarca(valor: string | null | undefined): valor is Marca {
  return !!valor && MARCAS.includes(valor);
}

export function esFabricante(
  valor: string | null | undefined
): valor is Fabricante {
  return !!valor && FABRICANTES.includes(valor);
}

export function esGenero(valor: string | null | undefined): valor is Genero {
  return !!valor && (GENEROS as string[]).includes(valor);
}

/**
 * Query param del filtro "solo casas originales": `/catalogo?casaoriginal=1`.
 * Antes era `?original=true`; se renombró porque se confundía con el modo del
 * catálogo (`?modo=original`), que es otra cosa. Lo genera la card
 * "Originales" de la Home y lo lee CatalogoCompleto.
 */
export const PARAM_CASA_ORIGINAL = "casaoriginal";
export const VALOR_CASA_ORIGINAL = "1";

export interface FiltrosCatalogo {
  fabricante?: Fabricante;
  categoria?: Categoria;
  marca?: Marca;
  genero?: Genero;
  tamano?: Tamano;
  /**
   * Solo fragancias de casa original (`esCasaOriginal`). No tiene nada que ver
   * con el modo "original" del catálogo. En la URL: `?casaoriginal=1`.
   */
  soloCasasOriginales?: boolean;
}

export function aplicarFiltros(
  lista: Producto[],
  {
    fabricante,
    categoria,
    marca,
    genero,
    tamano,
    soloCasasOriginales,
  }: FiltrosCatalogo
): Producto[] {
  return lista.filter(
    (p) =>
      (!fabricante || p.fabricante === fabricante) &&
      (!categoria || p.categoria === categoria) &&
      (!marca || p.marca === marca) &&
      (!genero || p.genero === genero) &&
      (!tamano || tamanoDe(p) === tamano) &&
      (!soloCasasOriginales || p.esCasaOriginal === true)
  );
}

// Re-export para que CatalogoCompleto importe todos los type guards de filtros
// desde el mismo módulo, aunque el de tamaño viva en lib/agrupacion.ts.
export { esTamano };

// ---------------------------------------------------------------- conteos ---
// Se calculan desde `productos`, no son números fijos.

// `lista`: los productos del modo (productosParaModo). Por defecto `productos`,
// que es la vista G5.
export function contarPorCategoria(
  categoria: Categoria,
  lista: Producto[] = productos
): number {
  return lista.filter((p) => p.categoria === categoria).length;
}

export function contarCasasOriginales(lista: Producto[] = productos): number {
  return lista.filter((p) => p.esCasaOriginal === true).length;
}

export function contarTodos(): number {
  return productos.length;
}
