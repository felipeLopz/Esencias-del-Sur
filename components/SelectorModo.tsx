import Link from "next/link";
import { MODOS, MODO_LABEL, type Modo } from "@/lib/catalogo";

// Pantalla "¿Original o G5?" que muestra /catalogo cuando no hay modo en la URL
// y la funcionalidad está visible (MODOS_CATALOGO_VISIBLE). Server component:
// son dos links a la misma URL con `?modo=` agregado, sin estado ni JS propio.
// Versión funcional mínima; el diseño final queda para cuando se lance.

const DETALLE: Record<Modo, string> = {
  original: "Fragancias originales de cada casa.",
  g5: "Réplicas de alta calidad, a menor precio.",
};

export default function SelectorModo({
  hrefs,
}: {
  /** Destino de cada opción: la URL actual con su `?modo=`. */
  hrefs: Record<Modo, string>;
}) {
  return (
    <section className="bg-azul-negro">
      <div className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="font-cinzel text-2xl text-blanco">
          ¿Qué catálogo querés ver?
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {/* Original primero: es la opción que se destaca. */}
          {[...MODOS].reverse().map((modo) => (
            <Link
              key={modo}
              href={hrefs[modo]}
              className="tarjeta block p-6"
            >
              <span className="block font-cinzel text-xl text-blanco">
                {MODO_LABEL[modo]}
              </span>
              <span className="mt-2 block text-gris-azul">{DETALLE[modo]}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
