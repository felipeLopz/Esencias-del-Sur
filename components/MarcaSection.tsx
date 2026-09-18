import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  productos as todosLosProductos,
  type Marca,
  type Producto,
} from "@/data/productos";

// Sub-sección de una marca dentro de una sección de tamaño (ver TamanoSection).
// Renderiza una grilla plana: el corte por formato ya lo hizo el nivel de
// arriba, así que acá todos los productos son del mismo tamaño.
//
// Props:
// - `productos`: lista sobre la que operar (default: todos). Normalmente llega
//   ya filtrada por tamaño y por categoría.
// - `staggerKey`: si se pasa, las tarjetas entran con el stagger y se re-animan
//   cuando cambia el valor (cambio de filtro).
export default function MarcaSection({
  marca,
  className = "",
  productos = todosLosProductos,
  staggerKey,
  agotados,
}: {
  marca: Marca;
  className?: string;
  productos?: Producto[];
  staggerKey?: string;
  /** Slugs sin stock, leídos de la base arriba de todo (ver lib/stock.ts). */
  agotados?: Set<string>;
}) {
  const deLaMarca = productos.filter((p) => p.marca === marca);
  if (deLaMarca.length === 0) return null;

  return (
    <section className={className}>
      <Reveal className="mx-auto max-w-6xl px-5 py-14">
        <h3 className="font-cinzel text-2xl text-blanco">{marca}</h3>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {deLaMarca.map((producto, i) => {
            const disponible = !agotados?.has(producto.slug);
            return staggerKey ? (
              <div
                key={`${staggerKey}-${producto.id}`}
                className="card-stagger"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard producto={producto} disponible={disponible} />
              </div>
            ) : (
              <ProductCard
                key={producto.id}
                producto={producto}
                disponible={disponible}
              />
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
