import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  productos as todosLosProductos,
  type Marca,
  type Producto,
} from "@/data/productos";

// Fondo fijo por marca (paleta existente). Cada marca conserva siempre su color
// —en la Home y en /catalogo— sin recalcular según cuáles secciones se muestren.
export const FONDO_MARCA: Record<Marca, string> = {
  "9PM": "bg-azul-osc",
  Odyssey: "bg-azul-med",
  Khamrah: "bg-azul-osc",
  "Club de Nuit": "bg-azul-med",
  "Badee Al Oud": "bg-azul-osc",
};

// Sección de una marca. Separa los productos de esa marca en dos grupos según
// el campo `formato`:
//   1. "Perfumes de tubo · 35ml"           → formato "tubo_35ml"
//   2. "Perfumes grandes · 50ml / 100ml"   → formato "grande_50ml" + "grande_100ml"
// Reusa ProductCard y el wrapper Reveal (mismo fade al entrar en viewport).
//
// Props:
// - `productos`: lista sobre la que operar (default: todos). Permite pasar una
//   lista ya filtrada (p. ej. por categoría en /catalogo).
// - `staggerKey`: si se pasa, las tarjetas entran con el stagger de
//   CatalogoFiltrable y se re-animan cuando cambia el valor (cambio de filtro).
function GrupoCards({
  titulo,
  items,
  staggerKey,
  className = "",
}: {
  titulo: string;
  items: Producto[];
  staggerKey?: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <p className="label-ui text-sm uppercase tracking-wide text-gris-azul">
        {titulo}
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((producto, i) =>
          staggerKey ? (
            <div
              key={`${staggerKey}-${producto.id}`}
              className="card-stagger"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ProductCard producto={producto} />
            </div>
          ) : (
            <ProductCard key={producto.id} producto={producto} />
          )
        )}
      </div>
    </div>
  );
}

export default function MarcaSection({
  marca,
  className = "",
  productos = todosLosProductos,
  staggerKey,
}: {
  marca: Marca;
  className?: string;
  productos?: Producto[];
  staggerKey?: string;
}) {
  const deLaMarca = productos.filter((p) => p.marca === marca);
  if (deLaMarca.length === 0) return null;

  const tubo = deLaMarca.filter((p) => p.formato === "tubo_35ml");
  const grandes = deLaMarca.filter(
    (p) => p.formato === "grande_50ml" || p.formato === "grande_100ml"
  );

  return (
    <section className={className}>
      <Reveal className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-cinzel text-3xl text-blanco">{marca}</h2>

        <GrupoCards
          titulo="Perfumes de tubo · 35ml"
          items={tubo}
          staggerKey={staggerKey}
          className="mt-10"
        />
        <GrupoCards
          titulo="Perfumes grandes · 50ml / 100ml"
          items={grandes}
          staggerKey={staggerKey}
          className="mt-12"
        />
      </Reveal>
    </section>
  );
}
