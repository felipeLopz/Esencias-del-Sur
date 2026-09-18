import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import CatalogoCompleto from "@/components/CatalogoCompleto";
import TamanoSection from "@/components/TamanoSection";
import { productos } from "@/data/productos";
import { TAMANOS } from "@/lib/agrupacion";
import { getDisponibilidad } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Catálogo — Esencias del Sur",
  description:
    "Todo el inventario de fragancias árabes, organizado por tamaño y por marca, filtrable por categoría.",
};

// Fallback del Suspense: el catálogo completo sin filtros, renderizado en el
// servidor. Es lo que ve alguien sin JS (CatalogoCompleto usa useSearchParams
// y necesita un boundary). También respeta el stock.
function ListadoSinFiltros({ agotados }: { agotados: Set<string> }) {
  return (
    <>
      {TAMANOS.map((tamano) => (
        <TamanoSection
          key={tamano}
          tamano={tamano}
          productos={productos}
          agotados={agotados}
        />
      ))}
    </>
  );
}

export default async function CatalogoPage() {
  // Lectura de stock en cada visita (ver lib/stock.ts): esto es lo que vuelve
  // dinámica a la ruta.
  const disponibilidad = await getDisponibilidad();
  const agotados = [...disponibilidad]
    .filter(([, disponible]) => !disponible)
    .map(([slug]) => slug);

  return (
    <>
      <Header />

      <main>
        <section className="bg-azul-negro">
          <div className="mx-auto max-w-6xl px-5 pt-16 pb-8">
            <h1 className="font-cinzel text-4xl text-blanco">
              Catálogo completo
            </h1>
            <p className="mt-2 max-w-xl text-gris-azul">
              Todo el inventario, organizado por tamaño y, dentro de cada
              tamaño, por marca.
            </p>
          </div>
        </section>

        <Suspense fallback={<ListadoSinFiltros agotados={new Set(agotados)} />}>
          <CatalogoCompleto agotados={agotados} />
        </Suspense>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
