import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import CatalogoPorMarca from "@/components/CatalogoPorMarca";

export const metadata: Metadata = {
  title: "Catálogo — Esencias del Sur",
  description:
    "Todas nuestras fragancias árabes, organizadas por marca y filtrables por categoría.",
};

export default function CatalogoPage() {
  return (
    <>
      <Header />

      <main>
        <CatalogoPorMarca />
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
