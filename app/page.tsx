import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import CarruselDestacados from "@/components/CarruselDestacados";
import Reveal from "@/components/Reveal";
import TypewriterHeadline from "@/components/TypewriterHeadline";
import { productos } from "@/data/productos";
import {
  TAMANOS,
  TAMANO_DETALLE,
  TAMANO_LABEL,
  filtrarPorTamano,
  marcasConProductos,
} from "@/lib/agrupacion";

export default function Home() {
  // Selección curada de la Home: los productos con `destacado: true` en
  // data/productos.ts. Si no hay ninguno marcado se caen los primeros 3, para
  // que la Home no quede sin productos a la vista.
  const marcados = productos.filter((p) => p.destacado === true);
  const destacados = marcados.length > 0 ? marcados : productos.slice(0, 3);

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
              text="Esencias del Sur"
              className="mx-auto max-w-3xl font-cinzel text-5xl leading-tight text-blanco sm:text-7xl"
            />
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gris-azul sm:text-2xl">
              Tu perfumería de confianza
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

        {/* DESTACADOS — azul-osc — carrusel */}
        <section id="destacados" className="bg-azul-osc">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <CarruselDestacados productos={destacados} />
          </Reveal>
        </section>

        {/* ACCESOS POR TAMAÑO — azul-med.
            Llevan a /catalogo con el filtro de tamaño ya aplicado. */}
        <section id="tamanos" className="bg-azul-med">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-cinzel text-3xl text-blanco">
              Explorá por tamaño
            </h2>
            <p className="mt-2 max-w-xl text-gris-azul">
              Todo el catálogo está organizado por tamaño y, dentro de cada uno,
              por marca.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {TAMANOS.map((tamano) => {
                const delTamano = filtrarPorTamano(productos, tamano);
                const marcas = marcasConProductos(delTamano).length;

                return (
                  <Link
                    key={tamano}
                    href={`/catalogo?tamano=${tamano}`}
                    className="tarjeta flex flex-col p-8"
                  >
                    <h3 className="font-cinzel text-2xl text-blanco">
                      {TAMANO_LABEL[tamano]}
                    </h3>
                    <p className="label-ui mt-2 text-sm uppercase tracking-wide text-gris-azul">
                      {TAMANO_DETALLE[tamano]}
                    </p>
                    <p className="mt-4 flex-1 text-gris-azul">
                      {delTamano.length}{" "}
                      {delTamano.length === 1 ? "fragancia" : "fragancias"} en{" "}
                      {marcas} {marcas === 1 ? "marca" : "marcas"}.
                    </p>
                    <span className="btn-pill btn-fill label-ui mt-6 self-start px-6 py-2 text-sm">
                      Ver {TAMANO_LABEL[tamano].toLowerCase()}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
