import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import CatalogoFiltrable from "@/components/CatalogoFiltrable";
import { productos } from "@/data/productos";

export const metadata: Metadata = {
  title: "Catálogo — Esencias del Sur",
  description: "Todas nuestras fragancias árabes, filtrables por categoría.",
};

export default function CatalogoPage() {
  return (
    <>
      <Header />

      <main className="bg-azul-med">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h1 className="font-cinzel text-4xl text-blanco">
            Catálogo completo
          </h1>
          <p className="mt-2 max-w-xl text-gris-azul">
            Explorá toda la colección y filtrá por categoría.
          </p>

          <div className="mt-10">
            <CatalogoFiltrable productos={productos} />
          </div>
        </div>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
