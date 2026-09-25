import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import CatalogoCompleto from "@/components/CatalogoCompleto";
import FabricanteSection from "@/components/FabricanteSection";
import SelectorModo from "@/components/SelectorModo";
import { FABRICANTES, type Producto } from "@/data/productos";
import {
  PARAM_MODO,
  hrefConModo,
  productosParaModo,
  resolverModo,
} from "@/lib/catalogo";
import { MODOS_CATALOGO_VISIBLE } from "@/lib/config";
import { getDisponibilidad } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Catálogo — Esencias del Sur",
  description:
    "Todo el inventario de fragancias árabes, organizado por fabricante y por línea, filtrable por tamaño, categoría y género.",
};

// Fallback del Suspense: el catálogo completo sin filtros, renderizado en el
// servidor. Es lo que ve alguien sin JS (CatalogoCompleto usa useSearchParams
// y necesita un boundary). También respeta el modo y el stock de ese modo.
function ListadoSinFiltros({
  productos,
  agotados,
}: {
  productos: Producto[];
  agotados: Set<string>;
}) {
  return (
    <>
      {FABRICANTES.map((fabricante) => (
        <FabricanteSection
          key={fabricante}
          fabricante={fabricante}
          productos={productos}
          agotados={agotados}
        />
      ))}
    </>
  );
}

type SearchParams = Promise<{ [clave: string]: string | string[] | undefined }>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Modo de catálogo (lib/catalogo.ts). Con un param repetido se toma el
  // primero, igual que `useSearchParams().get()` en el cliente: server y
  // cliente tienen que resolver siempre el mismo modo.
  const valorModo = [params[PARAM_MODO]].flat()[0];
  const modo = resolverModo(valorModo, MODOS_CATALOGO_VISIBLE);

  const encabezado = (
    <section className="bg-azul-negro">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-8">
        <h1 className="font-cinzel text-4xl text-blanco">
          Catálogo completo
        </h1>
        <p className="mt-2 max-w-xl text-gris-azul">
          Todo el inventario, organizado por fabricante y, dentro de cada
          fabricante, por línea.
        </p>
      </div>
    </section>
  );

  // Sin modo elegido: se pregunta antes de mostrar productos. Solo puede pasar
  // con MODOS_CATALOGO_VISIBLE prendido; apagado, sin modo = "g5" (lo de
  // siempre). Los links conservan el resto de la query (ej. si se llegó desde
  // "Trabajamos con" con ?fabricante=Lattafa).
  if (!modo) {
    const query = new URLSearchParams();
    for (const [clave, valor] of Object.entries(params)) {
      for (const v of [valor].flat()) if (v !== undefined) query.append(clave, v);
    }

    return (
      <>
        <Header />
        <main>
          {encabezado}
          <SelectorModo
            hrefs={{
              g5: hrefConModo("/catalogo", query, "g5"),
              original: hrefConModo("/catalogo", query, "original"),
            }}
          />
        </main>
        <Footer />
        <BotonFlotante />
      </>
    );
  }

  // Lectura de stock del modo en cada visita (ver lib/stock.ts): esto es lo
  // que vuelve dinámica a la ruta.
  const disponibilidad = await getDisponibilidad(modo);
  const agotados = [...disponibilidad]
    .filter(([, disponible]) => !disponible)
    .map(([slug]) => slug);

  return (
    <>
      <Header />

      <main>
        {encabezado}

        <Suspense
          fallback={
            <ListadoSinFiltros
              productos={productosParaModo(modo)}
              agotados={new Set(agotados)}
            />
          }
        >
          <CatalogoCompleto modo={modo} agotados={agotados} />
        </Suspense>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
