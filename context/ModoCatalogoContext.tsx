"use client";

import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  PARAM_MODO,
  conservarModo,
  hrefConModo,
  modoExplicito,
  resolverModo,
  type Modo,
} from "@/lib/catalogo";

// ============================================================================
// MODO DE CATÁLOGO ACTUAL (g5 / original), leído de la URL
// ----------------------------------------------------------------------------
// La ÚNICA fuente del modo es el query param `?modo=` de la URL actual. Nada se
// persiste: ni cookie, ni localStorage, ni sessionStorage. Así cada visita
// nueva arranca sin modo elegido, y un link compartido lleva su modo consigo.
//
// Se monta UNA vez en el layout raíz y lo usan links, carrito, buscador,
// comparador, etc.
//
// Diseño (importa, no simplificar sin leer):
// useSearchParams tiene que ir dentro de un <Suspense> (en rutas estáticas como
// /comparar no hay URL durante el build y Next renderiza el fallback). Pero ese
// <Suspense> NO puede envolver a los children: si los envuelve, cada página
// pasa a hacer streaming a través de él y el HTML sale DOS veces (fallback +
// versión real escondida), con el doble de consultas a la base por visita.
// Por eso el <Suspense> envuelve solo a <SincronizarModo>, un componente que no
// renderiza nada: lee la URL y copia el modo a un estado del provider.
//
// Consecuencia: en el HTML del server `modoEnUrl` es siempre null, y recién en
// el navegador toma el valor de la URL (un instante después de cargar). Para
// links y componentes interactivos (carrito, buscador) eso no se nota. Lo que
// tiene que salir con el modo correcto YA en el HTML del server (lista del
// catálogo, ficha, Home) NO lee el modo de acá: lo recibe como prop de su
// página, que sí lo conoce porque lee `searchParams`.
// ============================================================================

interface ValorModoCatalogo {
  /**
   * Modo activo. `null` = todavía no se eligió y hay que preguntar (solo pasa
   * con la funcionalidad visible; oculta, sin modo en la URL es "g5").
   */
  modo: Modo | null;
  /**
   * El modo que vino EXPLÍCITO en la URL (`?modo=` válido), o null. Es el que
   * se propaga a los links: sin modo en la URL, los links no agregan nada.
   */
  modoEnUrl: Modo | null;
  /** Valor de MODOS_CATALOGO_VISIBLE, pasado desde el server. */
  modosVisibles: boolean;
  /** Un `href` interno conservando el `?modo=` actual (si lo hay). */
  conModo: (href: string) => string;
  /** La URL actual en otro modo, conservando el resto de la query. */
  hrefEnModo: (modo: Modo) => string;
}

const ModoCatalogoContext = createContext<ValorModoCatalogo | null>(null);

/** Lee la URL y le pasa el modo explícito (y la query) al provider. No
 * renderiza nada. Vive dentro de su propio <Suspense>. */
function SincronizarModo({
  alCambiar,
}: {
  alCambiar: (modoEnUrl: Modo | null, query: string) => void;
}) {
  const searchParams = useSearchParams();
  const modoEnUrl = modoExplicito(searchParams.get(PARAM_MODO));
  const query = searchParams.toString();

  useEffect(() => {
    alCambiar(modoEnUrl, query);
  }, [alCambiar, modoEnUrl, query]);

  return null;
}

export function ModoCatalogoProvider({
  modosVisibles,
  children,
}: {
  /**
   * Valor de MODOS_CATALOGO_VISIBLE (lib/config.ts). Llega como prop porque es
   * una variable de servidor: en el navegador siempre se leería `false`.
   */
  modosVisibles: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [url, setUrl] = useState<{ modoEnUrl: Modo | null; query: string }>({
    modoEnUrl: null,
    query: "",
  });

  // Estable: si cambiara en cada render, el efecto de SincronizarModo se
  // volvería a disparar sin que cambie la URL.
  const alCambiar = useMemo(
    () => (modoEnUrl: Modo | null, query: string) =>
      setUrl((prev) =>
        prev.modoEnUrl === modoEnUrl && prev.query === query
          ? prev
          : { modoEnUrl, query }
      ),
    []
  );

  const valor = useMemo<ValorModoCatalogo>(
    () => ({
      modo: resolverModo(url.modoEnUrl, modosVisibles),
      modoEnUrl: url.modoEnUrl,
      modosVisibles,
      conModo: (href) => conservarModo(href, url.modoEnUrl),
      hrefEnModo: (modo) => hrefConModo(pathname, url.query, modo),
    }),
    [url, modosVisibles, pathname]
  );

  return (
    <ModoCatalogoContext.Provider value={valor}>
      <Suspense fallback={null}>
        <SincronizarModo alCambiar={alCambiar} />
      </Suspense>
      {children}
    </ModoCatalogoContext.Provider>
  );
}

export function useModoCatalogo(): ValorModoCatalogo {
  const valor = useContext(ModoCatalogoContext);
  if (!valor) {
    throw new Error(
      "useModoCatalogo tiene que usarse dentro de <ModoCatalogoProvider>."
    );
  }
  return valor;
}
