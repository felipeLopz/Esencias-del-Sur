import { productos, type Modo, type Producto } from "@/data/productos";

// ============================================================================
// MODOS DE CATÁLOGO: "g5" (réplica) y "original"
// ----------------------------------------------------------------------------
// El mismo perfume se vende en dos modos, con precio propio (y stock propio,
// ver lib/stock.ts) en cada uno. Este módulo convierte los datos crudos de
// data/productos.ts en la vista de un modo concreto.
//
// Reglas:
//   - G5 existe para todos los productos (es lo que la web vendió siempre).
//   - Original es opcional: un producto sin `precios.original` NO aparece en el
//     catálogo Original (`productoParaModo` devuelve undefined).
//   - El modo NUNCA se persiste entre visitas (ni cookie, ni localStorage, ni
//     sessionStorage): vive solo en la URL (`?modo=`). Ver
//     context/ModoCatalogoContext.tsx.
//
// Dependencias: este archivo importa de data/productos.ts y nunca al revés.
// ============================================================================

export type { Modo };

export const MODOS: Modo[] = ["g5", "original"];

/** Query param que lleva el modo en la URL: /catalogo?modo=original */
export const PARAM_MODO = "modo";

export const MODO_LABEL: Record<Modo, string> = {
  g5: "G5 (réplicas)",
  original: "Original",
};

/** Etiqueta corta del modo, para carrito y mensaje de WhatsApp. */
export const MODO_CORTO: Record<Modo, string> = {
  g5: "G5",
  original: "Original",
};

export function esModo(valor: string | null | undefined): valor is Modo {
  return valor === "g5" || valor === "original";
}

/**
 * Qué modo usar según lo que venga en la URL.
 *
 * - Modo válido en la URL: ese, siempre. Por eso un link directo con
 *   `?modo=original` funciona aunque la funcionalidad esté oculta.
 * - Sin modo (o inválido) y funcionalidad OCULTA: "g5". Es exactamente el
 *   comportamiento de antes de existir los modos.
 * - Sin modo y funcionalidad VISIBLE: `null`, es decir, hay que preguntarle al
 *   visitante (cada visita arranca sin modo elegido).
 */
export function resolverModo(
  valorEnUrl: string | null | undefined,
  modosVisibles: boolean
): Modo | null {
  if (esModo(valorEnUrl)) return valorEnUrl;
  return modosVisibles ? null : "g5";
}

/**
 * `href` con el modo agregado (o reemplazado), preservando el resto de la
 * query. Ej: hrefConModo("/catalogo", "fabricante=Lattafa", "original")
 * -> "/catalogo?fabricante=Lattafa&modo=original".
 */
export function hrefConModo(
  pathname: string,
  query: string | URLSearchParams,
  modo: Modo
): string {
  const params = new URLSearchParams(query);
  params.set(PARAM_MODO, modo);
  return `${pathname}?${params.toString()}`;
}

/** El modo que viene EXPLÍCITO en la URL (param válido), o null. A diferencia
 * de `resolverModo`, nunca completa con un default. */
export function modoExplicito(valorEnUrl: string | null | undefined): Modo | null {
  return esModo(valorEnUrl) ? valorEnUrl : null;
}

/**
 * Un link interno que conserva el modo de la URL actual: si `modoEnUrl` es null
 * (no hay `?modo=` explícito: flag apagado o primera navegación), devuelve el
 * `href` intacto; si no, le agrega `?modo=` respetando su query y su #hash.
 * Ej: ("/catalogo?tamano=chico", "original") -> "/catalogo?tamano=chico&modo=original"
 */
export function conservarModo(href: string, modoEnUrl: Modo | null): string {
  if (!modoEnUrl) return href;
  const [sinHash, hash] = href.split("#");
  const [ruta, query = ""] = sinHash.split("?");
  const params = new URLSearchParams(query);
  params.set(PARAM_MODO, modoEnUrl);
  return `${ruta}?${params.toString()}${hash !== undefined ? `#${hash}` : ""}`;
}

// ------------------------------------------------------------------- ids ---
// El `id` de un producto resuelto tiene que ser único POR MODO: carrito y
// comparador indexan por `id`, y el mismo perfume en G5 y en Original son dos
// ítems distintos (precio distinto). G5 conserva el id de siempre (offset 0)
// para no invalidar los carritos que ya están guardados en localStorage de los
// visitantes. Original se corre 10.000: con 48 productos hay margen de sobra
// (el día que haya más de 10.000 productos, subir el offset).
const OFFSET_ID: Record<Modo, number> = {
  g5: 0,
  original: 10000,
};

export function idParaModo(idBase: number, modo: Modo): number {
  return idBase + OFFSET_ID[modo];
}

// ------------------------------------------------------------ resolución ---

/**
 * El producto visto en `modo`: `id`, `precio` y `precioDecant` resueltos para
 * ese modo y `modo` marcado. Devuelve `undefined` si el producto no tiene
 * precio en ese modo (no se vende en ese modo).
 *
 * Acepta cualquier `Producto`, esté resuelto en el modo que esté: siempre
 * resuelve desde `idBase`, `precios` y `decant`, que no cambian entre modos.
 */
export function productoParaModo(
  producto: Producto,
  modo: Modo
): Producto | undefined {
  const precio = producto.precios[modo];
  if (precio === undefined) return undefined;

  return {
    ...producto,
    modo,
    id: idParaModo(producto.idBase, modo),
    precio,
    precioDecant: producto.decant?.[modo],
  };
}

// Los datos son estáticos: cada lista se arma una sola vez por modo. Además
// así la referencia es estable (sirve como dependencia de useMemo).
const cachePorModo = new Map<Modo, Producto[]>();

/** Todos los productos que se venden en `modo`, ya resueltos para ese modo. */
export function productosParaModo(modo: Modo): Producto[] {
  let lista = cachePorModo.get(modo);
  if (!lista) {
    lista = productos.flatMap((p) => productoParaModo(p, modo) ?? []);
    cachePorModo.set(modo, lista);
  }
  return lista;
}

/** Un producto por slug, resuelto en `modo`. undefined si no existe o no se
 * vende en ese modo. */
export function getProductoParaModo(
  slug: string,
  modo: Modo
): Producto | undefined {
  return productosParaModo(modo).find((p) => p.slug === slug);
}

// ----------------------------------------------------------------- ficha ---

const AVISO_SUSTITUTO: Record<Modo, string> = {
  // Clave = modo que se MUESTRA en lugar del pedido.
  g5: "Todavía no tenemos este perfume en versión Original, te mostramos la réplica G5.",
  original:
    "Todavía no tenemos este perfume en versión G5, te mostramos la versión Original.",
};

/**
 * Lo que muestra la ficha de `slug` cuando se pide en `modoPedido`.
 *
 * Si el perfume no se vende en ese modo, NO es un 404: se muestra el otro modo
 * con un aviso (`aviso`). Solo devuelve undefined si el slug no existe.
 */
export function resolverFicha(
  slug: string,
  modoPedido: Modo
): { producto: Producto; modo: Modo; aviso?: string } | undefined {
  const pedido = getProductoParaModo(slug, modoPedido);
  if (pedido) return { producto: pedido, modo: modoPedido };

  const otroModo = MODOS.find((m) => m !== modoPedido);
  const sustituto = otroModo && getProductoParaModo(slug, otroModo);
  if (!otroModo || !sustituto) return undefined;
  return { producto: sustituto, modo: otroModo, aviso: AVISO_SUSTITUTO[otroModo] };
}

// ---------------------------------------------------------------- decant ---
// El decant de 5 ml NO es un producto del catálogo: vive dentro de la ficha.
// Para el carrito se representa como un `Producto` más (así carrito, stepper y
// WhatsApp lo tratan igual que a un frasco), con `id` propio: el id del frasco
// en su modo + 50.000. Así no choca con el frasco del mismo modo (1-48 /
// 10.001-10.048) ni con el decant del otro modo (50.001-50.048 / 60.001-60.048).
const OFFSET_ID_DECANT = 50000;

export const ML_DECANT = 5;

/** El decant de un producto YA resuelto en un modo, o undefined si en ese modo
 * no tiene precio de decant. */
export function decantDe(producto: Producto): Producto | undefined {
  if (producto.esDecant || producto.precioDecant === undefined) return undefined;
  return {
    ...producto,
    id: producto.id + OFFSET_ID_DECANT,
    mililitros: ML_DECANT,
    precio: producto.precioDecant,
    precioDecant: undefined,
    esDecant: true,
  };
}

/** "100 ml", o "Decant 5 ml" si es un decant. Para carrito y WhatsApp. */
export function presentacionLabel(producto: Producto): string {
  return producto.esDecant
    ? `Decant ${producto.mililitros} ml`
    : `${producto.mililitros} ml`;
}

// ------------------------------------------------------ carrito guardado ---

/**
 * Completa un producto leído del carrito guardado en localStorage.
 *
 * Los carritos guardados antes de existir los modos no tienen `modo`,
 * `idBase` ni `precios`, y el flag de casa original se llamaba `original`.
 * Todo lo guardado entonces era G5 (el único modo que existía) y el id G5 no
 * cambió, así que se completa como G5 sin tocar id, precio ni cantidad.
 */
export function normalizarProductoGuardado(guardado: unknown): Producto {
  const p = guardado as Producto & { original?: boolean };
  if (p.modo && p.idBase !== undefined && p.precios) return p;

  const { original, ...resto } = p;
  return {
    ...resto,
    modo: p.modo ?? "g5",
    idBase: p.idBase ?? p.id,
    precios: p.precios ?? { g5: p.precio },
    esCasaOriginal: p.esCasaOriginal ?? original,
  };
}

/**
 * ¿Hay que decir el modo de cada ítem (carrito / WhatsApp)? Sí si los modos
 * están visibles, o si en el carrito hay algo que no es G5. Con los modos
 * ocultos y todo G5 (el caso de hoy) no se agrega nada: queda igual que antes.
 */
export function debeMostrarModo(
  productosDelCarrito: Producto[],
  modosVisibles: boolean
): boolean {
  // `?? "g5"`: un producto sin modo (carrito viejo sin normalizar) es G5.
  return (
    modosVisibles ||
    productosDelCarrito.some((p) => (p.modo ?? "g5") !== "g5")
  );
}
