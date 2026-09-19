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

export interface FiltrosCatalogo {
  fabricante?: Fabricante;
  categoria?: Categoria;
  marca?: Marca;
  genero?: Genero;
  tamano?: Tamano;
  soloOriginales?: boolean;
}

export function aplicarFiltros(
  lista: Producto[],
  {
    fabricante,
    categoria,
    marca,
    genero,
    tamano,
    soloOriginales,
  }: FiltrosCatalogo
): Producto[] {
  return lista.filter(
    (p) =>
      (!fabricante || p.fabricante === fabricante) &&
      (!categoria || p.categoria === categoria) &&
      (!marca || p.marca === marca) &&
      (!genero || p.genero === genero) &&
      (!tamano || tamanoDe(p) === tamano) &&
      (!soloOriginales || p.original === true)
  );
}

// Re-export para que CatalogoCompleto importe todos los type guards de filtros
// desde el mismo módulo, aunque el de tamaño viva en lib/agrupacion.ts.
export { esTamano };

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
