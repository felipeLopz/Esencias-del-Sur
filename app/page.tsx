import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import ProductCard from "@/components/ProductCard";
import CatalogoFiltrable from "@/components/CatalogoFiltrable";
import Reveal from "@/components/Reveal";
import TypewriterHeadline from "@/components/TypewriterHeadline";
import { productos } from "@/data/productos";

export default function Home() {
  const destacados = productos.slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* HERO — azul-negro */}
        <section className="bg-azul-negro">
          <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:py-32">
            <p className="label-ui mb-4 text-xs uppercase tracking-wide text-gris-azul">
              Perfumería árabe de autor
            </p>
            <TypewriterHeadline
              text="El lujo del desierto, en cada gota"
              className="mx-auto max-w-3xl font-cinzel text-4xl leading-tight text-blanco sm:text-6xl"
            />
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gris-azul sm:text-xl">
              Oud, ámbar y florales opulentos. Fragancias intensas y duraderas,
              seleccionadas para quienes buscan una firma inolvidable.
            </p>
            <div className="mt-10">
              <Link
                href="/catalogo"
                className="btn-pill btn-fill label-ui px-8 py-3 text-base"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        </section>

        {/* DESTACADOS — azul-osc */}
        <section id="destacados" className="bg-azul-osc">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-cinzel text-3xl text-blanco">Destacados</h2>
            <p className="mt-2 max-w-xl text-gris-azul">
              Nuestras fragancias más queridas para empezar a descubrir la
              colección.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </Reveal>
        </section>

        {/* CATÁLOGO COMPLETO — azul-med */}
        <section id="catalogo" className="bg-azul-med">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-cinzel text-3xl text-blanco">
              Catálogo completo
            </h2>
            <p className="mt-2 max-w-xl text-gris-azul">
              Filtrá por categoría para encontrar tu próxima fragancia.
            </p>

            <div className="mt-10">
              <CatalogoFiltrable productos={productos} />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
