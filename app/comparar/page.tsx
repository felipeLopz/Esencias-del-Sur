import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import ComparadorSelector from "@/components/ComparadorSelector";
import { MAX_COMPARAR } from "@/context/ComparadorContext";

export const metadata: Metadata = {
  title: "Comparar productos — Esencias del Sur",
  description:
    "Elegí hasta 3 fragancias del catálogo y compará precio, tamaño, categoría y descripción lado a lado.",
};

export default function CompararPage() {
  return (
    <>
      <Header />

      <main>
        <section className="bg-azul-negro">
          <div className="mx-auto max-w-6xl px-5 pt-16 pb-8">
            <h1 className="font-cinzel text-4xl text-blanco">
              Comparar productos
            </h1>
            <p className="mt-2 max-w-xl text-gris-azul">
              Elegí hasta {MAX_COMPARAR} fragancias y compará precio, tamaño y
              descripción lado a lado. Tu selección queda a mano en la barra
              de abajo para abrir la tabla cuando quieras.
            </p>
          </div>
        </section>

        <section className="bg-azul-osc">
          <div className="mx-auto max-w-6xl px-5 py-10">
            <ComparadorSelector />
          </div>
        </section>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
