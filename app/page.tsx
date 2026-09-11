import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import Marquee from "@/components/Marquee";
import MotivoRosaDelDesierto from "@/components/MotivoRosaDelDesierto";
import IconoCategoria, {
  type IconoCategoriaNombre,
} from "@/components/IconoCategoria";
import Faq from "@/components/Faq";
import ProductCard from "@/components/ProductCard";
import QuizGuia from "@/components/QuizGuia";
import Reveal from "@/components/Reveal";
import { productos } from "@/data/productos";
import { MARCAS, MARCA_OTRAS } from "@/data/productos";
import { contarPorTamano } from "@/lib/agrupacion";
import { contarOriginales, contarPorCategoria } from "@/lib/filtros";
import { linkConsultaWhatsApp } from "@/lib/whatsapp";

// --------------------------------------------------------------- bloque 4 ---
// Conteos calculados desde productos.ts, no fijos.
// "Ofertas" y "Novedades" no tienen campo en los datos todavía: van sin número
// y linkean al catálogo general (ver resumen).
type Acceso = {
  nombre: string;
  icono: IconoCategoriaNombre;
  href: string;
  detalle: string;
};

const ACCESOS: Acceso[] = [
  {
    nombre: "Perfumes grandes",
    icono: "frasco-grande",
    href: "/catalogo?tamano=grande",
    detalle: `${contarPorTamano(productos, "grande")} productos`,
  },
  {
    nombre: "Perfumes chicos",
    icono: "frasco-chico",
    href: "/catalogo?tamano=chico",
    detalle: `${contarPorTamano(productos, "chico")} productos`,
  },
  {
    nombre: "Ofertas",
    icono: "oferta",
    href: "/catalogo",
    detalle: "Próximamente",
  },
  {
    nombre: "Sets regalo",
    icono: "regalo",
    href: `/catalogo?categoria=${encodeURIComponent("Sets regalo")}`,
    detalle: `${contarPorCategoria("Sets regalo")} productos`,
  },
  {
    nombre: "Originales",
    icono: "original",
    href: "/catalogo?original=true",
    detalle: `${contarOriginales()} ${contarOriginales() === 1 ? "producto" : "productos"}`,
  },
  {
    nombre: "Novedades",
    icono: "novedad",
    href: "/catalogo",
    detalle: "Próximamente",
  },
  {
    nombre: "Comparar productos",
    icono: "comparar",
    href: "/comparar",
    detalle: "Hasta 3 productos",
  },
];

export default function Home() {
  // Bloque 7: los marcados con `destacado: true`; si no hay ninguno, los 3
  // primeros, para que la Home no quede sin productos a la vista.
  const marcados = productos.filter((p) => p.destacado === true);
  const destacados = marcados.length > 0 ? marcados : productos.slice(0, 3);

  // Bloque 5: las marcas reales, sin el paraguas "Otras marcas".
  const marcasReales = MARCAS.filter((m) => m !== MARCA_OTRAS);

  const waHref = linkConsultaWhatsApp();

  return (
    <>
      <Header />

      <main>
        {/* ============================================== BLOQUE 2 — HERO === */}
        <section className="bg-azul-negro">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            {/* El motivo va primero en el DOM para quedar arriba en mobile,
                y se manda a la derecha en desktop con order. */}
            <div className="order-first flex justify-center lg:order-last">
              <MotivoRosaDelDesierto className="h-56 w-56 text-blanco sm:h-72 sm:w-72 lg:h-[22rem] lg:w-[22rem]" />
            </div>

            <div className="text-center lg:text-left">
              <p className="label-ui mb-4 text-xs uppercase tracking-wide text-gris-azul">
                Perfumería árabe · Esencias del Sur
              </p>
              <h1 className="font-cinzel text-4xl leading-tight text-blanco sm:text-5xl lg:text-6xl">
                Todo el perfume árabe
                <br />
                en un solo lugar
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-gris-azul sm:text-xl lg:mx-0">
                Originales e inspirados, con stock real y envíos a todo el país.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  href="/catalogo"
                  className="btn-pill btn-primario label-ui px-8 py-3 text-base"
                >
                  Ver catálogo
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill btn-fill label-ui px-8 py-3 text-base"
                >
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================== BLOQUE 3 — MARQUEE === */}
        <Marquee />

        {/* ============================ BLOQUE 4 — ¿QUÉ ESTÁS BUSCANDO? === */}
        <section id="buscando" className="bg-azul-osc">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-cinzel text-3xl text-blanco">
              ¿Qué estás buscando?
            </h2>
            <p className="mt-2 max-w-xl text-gris-azul">
              Entrá directo a la parte del catálogo que te interesa.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ACCESOS.map((a) => (
                <Link
                  key={a.nombre}
                  href={a.href}
                  className="tarjeta flex items-center gap-4 p-5"
                >
                  <span className="acceso-icono text-blanco">
                    <IconoCategoria nombre={a.icono} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-cinzel text-lg text-blanco">
                      {a.nombre}
                    </span>
                    <span className="label-ui block text-xs uppercase tracking-wide text-gris-azul">
                      {a.detalle}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ================================= BLOQUE 5 — TRABAJAMOS CON === */}
        <section id="marcas" className="bg-azul-med">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-cinzel text-3xl text-blanco">Trabajamos con</h2>
            <p className="mt-2 max-w-xl text-gris-azul">
              Las líneas que tenemos en stock. Tocá una para ver solo sus
              productos.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {marcasReales.map((marca) => (
                <Link
                  key={marca}
                  href={`/catalogo?marca=${encodeURIComponent(marca)}`}
                  className="marca-chip"
                >
                  {marca}
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ========================= BLOQUE 6 — ¿NO SABÉS CUÁL ELEGIR? === */}
        <section className="bg-azul-osc">
          <Reveal className="mx-auto max-w-6xl px-5 py-20 text-center">
            <h2 className="font-cinzel text-3xl text-blanco">
              ¿No sabés cuál elegir?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-gris-azul">
              Respondé unas preguntas cortas y te recomendamos tu perfume ideal.
            </p>
            <div className="mt-8">
              <QuizGuia />
            </div>
          </Reveal>
        </section>

        {/* ============================= BLOQUE 7 — DESTACADOS DEL MES === */}
        <section id="destacados" className="bg-azul-med">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-3xl text-blanco">
                  Destacados del mes
                </h2>
                <p className="mt-2 max-w-xl text-gris-azul">
                  Nuestra selección para empezar a descubrir la colección.
                </p>
              </div>
              <Link
                href="/catalogo"
                className="nav-link label-ui shrink-0 text-sm text-blanco/90 hover:text-blanco"
              >
                Ver todo →
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destacados.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </Reveal>
        </section>

        {/* ============================ BLOQUE 8 — BANNER DE WHATSAPP === */}
        <section className="bg-azul-negro">
          <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-20 text-center">
            <h2 className="font-cinzel text-3xl text-blanco">
              ¿Tenés dudas? Escribinos
            </h2>
            <p className="max-w-xl text-lg text-gris-azul">
              Te asesoramos y coordinamos el envío por WhatsApp.
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-primario label-ui px-10 py-4 text-lg"
            >
              Pedí por WhatsApp
            </a>
          </Reveal>
        </section>

        {/* ==================================== BLOQUE 8.5 — PREGUNTAS === */}
        <section id="faq" className="bg-azul-med">
          <Reveal className="mx-auto max-w-3xl px-5 py-20">
            <h2 className="text-center font-cinzel text-3xl text-blanco">
              Preguntas frecuentes
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-gris-azul">
              Lo que más nos preguntan por WhatsApp, acá a mano.
            </p>

            <div className="mt-10">
              <Faq />
            </div>
          </Reveal>
        </section>

        {/* ================================= BLOQUE 9 — MAPA / COBERTURA === */}
        <section id="cobertura" className="bg-azul-osc">
          <Reveal className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
            <div>
              <h2 className="font-cinzel text-3xl text-blanco">
                Retirás en Guaymallén o Godoy Cruz
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gris-azul">
                Coordinás el retiro por WhatsApp cuando hacés el pedido. Sin
                envíos, sin local a la calle.
              </p>
              <p className="label-ui mt-6 text-sm uppercase tracking-wide text-gris-azul">
                Venta online · Sin local a la calle
              </p>
            </div>

            <div className="tarjeta relative aspect-[4/3] overflow-hidden">
              <iframe
                title="Zona de retiro: Guaymallén y Godoy Cruz, Mendoza"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  "Guaymallén y Godoy Cruz, Mendoza, Argentina"
                )}&z=12&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <BotonFlotante />
    </>
  );
}
