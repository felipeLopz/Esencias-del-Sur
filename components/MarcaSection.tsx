import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import {
  productos as todosLosProductos,
  type Marca,
  type Producto,
} from "@/data/productos";

// Sub-sección de una línea/marca dentro de un bloque de fabricante (ver
// FabricanteSection). Renderiza una grilla plana: el corte por fabricante ya lo
// hizo el nivel de arriba. El fondo lo pone el bloque de fabricante, así que
// acá no se pasa color (todas las líneas de un fabricante comparten tono).
//
// Props:
// - `productos`: lista sobre la que operar (default: todos). Normalmente llega
//   ya filtrada por fabricante y por los filtros del catálogo.
// - `staggerKey`: si se pasa, las tarjetas entran con el stagger y se re-animan
//   cuando cambia el valor (cambio de filtro).
export default function MarcaSection({
  marca,
  titulo,
  className = "",
  productos = todosLosProductos,
  staggerKey,
  agotados,
}: {
  marca: Marca;
  /**
   * Encabezado visible, si tiene que diferir del nombre de la marca. Lo usa
   * FabricanteSection para la marca paraguas MARCA_OTRAS, que como sub-línea de
   * un fabricante concreto no se puede rotular "Otras marcas".
   */
  titulo?: string;
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
        <h3 className="font-cinzel text-2xl text-blanco">{titulo ?? marca}</h3>

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
