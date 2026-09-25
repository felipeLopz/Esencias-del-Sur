import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BotonFlotante from "@/components/BotonFlotante";
import Marquee from "@/components/Marquee";
import MotivoRosaDelDesierto from "@/components/MotivoRosaDelDesierto";
import IconoCategoria, {
  type IconoCategoriaNombre,
} from "@/components/IconoCategoria";
import Faq from "@/components/Faq";
import LinkConModo from "@/components/LinkConModo";
import ProductCard from "@/components/ProductCard";
import QuizGuia from "@/components/QuizGuia";
import Reveal from "@/components/Reveal";
import { FABRICANTES, FABRICANTE_OTRAS, type Producto } from "@/data/productos";
import { contarPorTamano } from "@/lib/agrupacion";
import { PARAM_MODO, productosParaModo, resolverModo } from "@/lib/catalogo";
import { MODOS_CATALOGO_VISIBLE } from "@/lib/config";
import {
  PARAM_CASA_ORIGINAL,
  VALOR_CASA_ORIGINAL,
  contarCasasOriginales,
  contarPorCategoria,
} from "@/lib/filtros";
import { getProductosConStock } from "@/lib/stock";
import { linkConsultaWhatsApp } from "@/lib/whatsapp";

// --------------------------------------------------------------- bloque 4 ---
// Conteos calculados desde los productos del modo activo, no fijos.
// "Ofertas" y "Novedades" no tienen campo en los datos todavía: van sin número
// y linkean al catálogo general (ver resumen).
type Acceso = {
  nombre: string;
  icono: IconoCategoriaNombre;
  href: string;
  detalle: string;
};

// `productos`: los del modo activo (productosParaModo). Los `href` van sin
// modo: los links (LinkConModo) le agregan el `?modo=` actual si lo hay.
function accesosPara(productos: Producto[]): Acceso[] {
  const casasOriginales = contarCasasOriginales(productos);

  return [
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
      detalle: `${contarPorCategoria("Sets regalo", productos)} productos`,
    },
    {
      nombre: "Originales",
      icono: "original",
      href: `/catalogo?${PARAM_CASA_ORIGINAL}=${VALOR_CASA_ORIGINAL}`,
      detalle: `${casasOriginales} ${casasOriginales === 1 ? "producto" : "productos"}`,
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
}

// Mapa de cobertura: embed de OpenStreetMap encuadrado por bbox (oeste, sur,
// este, norte). Un `q=` de Google geocodea a UN solo lugar y con `z` fijo no
// garantiza encuadre; el bbox sí: el marco muestra siempre esta extensión, en
// escritorio y en celular. Cubre Godoy Cruz (SO), el Centro de Ciudad (NO) y
// la zona urbana de Guaymallén (E). Para ajustar el encuadre, tocar el bbox.
const MAPA_BBOX = "-68.905,-32.965,-68.775,-32.855";
const MAPA_COBERTURA_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(MAPA_BBOX)}&layer=mapnik`;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [clave: string]: string | string[] | undefined }>;
}) {
  // Modo de catálogo (?modo=). La Home no pregunta: sin modo en la URL muestra
  // G5, igual que siempre. Con un param repetido se toma el primero (igual que
  // useSearchParams().get() en el cliente).
  const valorModo = [(await searchParams)[PARAM_MODO]].flat()[0];
  const modo = resolverModo(valorModo, MODOS_CATALOGO_VISIBLE) ?? "g5";
  const accesos = accesosPara(productosParaModo(modo));

  // Bloque 7: los marcados con `destacado: true`; si no hay ninguno, los 3
  // primeros, para que la Home no quede sin productos a la vista.
  // `getProductosConStock` agrega el `disponible` de la base a cada uno: eso
  // es lo que vuelve dinámica la Home (ver lib/stock.ts).
  const conStock = await getProductosConStock(modo);
  const marcados = conStock.filter((p) => p.destacado === true);
  const destacados = marcados.length > 0 ? marcados : conStock.slice(0, 3);

  // Bloque 5: los fabricantes reales, sin el paraguas "Otras marcas".
  const fabricantesReales = FABRICANTES.filter((f) => f !== FABRICANTE_OTRAS);

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
                Originales e inspirados, con envíos en Guaymallén, Godoy Cruz y el Centro.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
                <LinkConModo
                  href="/catalogo"
                  className="btn-pill btn-primario label-ui px-8 py-3 text-base"
                >
                  Ver catálogo
                </LinkConModo>
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
              {accesos.map((a) => (
                <LinkConModo
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
                </LinkConModo>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ================================= BLOQUE 5 — TRABAJAMOS CON === */}
        <section id="marcas" className="bg-azul-med">
          <Reveal className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-cinzel text-3xl text-blanco">Trabajamos con</h2>
            <p className="mt-2 max-w-xl text-gris-azul">
              Las casas con las que trabajamos. Tocá una para ver solo sus
              productos.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {fabricantesReales.map((fabricante) => (
                <LinkConModo
                  key={fabricante}
                  href={`/catalogo?fabricante=${encodeURIComponent(fabricante)}`}
                  className="marca-chip"
                >
                  {fabricante}
                </LinkConModo>
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
              <LinkConModo
                href="/catalogo"
                className="nav-link label-ui shrink-0 text-sm text-blanco/90 hover:text-blanco"
              >
                Ver todo →
              </LinkConModo>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {destacados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  disponible={producto.disponible}
                />
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
                Retirás en Guaymallén o te lo enviamos
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gris-azul">
                Retirás tu pedido en nuestra casa en Guaymallén, o te lo
                llevamos a domicilio en Guaymallén, Godoy Cruz y el Centro.
                Coordinás todo por WhatsApp.
              </p>
              <p className="label-ui mt-6 text-sm uppercase tracking-wide text-gris-azul">
                Venta online · Sin local a la calle
              </p>
            </div>

            <div className="tarjeta relative aspect-[4/3] overflow-hidden">
              <iframe
                title="Zonas de envío: Guaymallén, Godoy Cruz y el Centro, Mendoza"
                src={MAPA_COBERTURA_SRC}
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
