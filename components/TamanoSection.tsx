import Reveal from "@/components/Reveal";
import MarcaSection from "@/components/MarcaSection";
import type { Producto } from "@/data/productos";
import {
  TAMANO_DETALLE,
  fondoDeMarca,
  TAMANO_LABEL,
  filtrarPorTamano,
  marcasConProductos,
  type Tamano,
} from "@/lib/agrupacion";

// Primer nivel de la jerarquía: una sección grande por tamaño ("Perfumes
// grandes" / "Perfumes chicos"), con una banda de encabezado y debajo las
// sub-secciones por marca (MarcaSection, con su tono estable via fondoDeMarca).
// Si el tamaño no tiene productos tras los filtros, no renderiza nada.
export default function TamanoSection({
  tamano,
  productos,
  staggerKey,
}: {
  tamano: Tamano;
  productos: Producto[];
  staggerKey?: string;
}) {
  const delTamano = filtrarPorTamano(productos, tamano);
  if (delTamano.length === 0) return null;

  const marcas = marcasConProductos(delTamano);

  return (
    <>
      <section id={`tamano-${tamano}`} className="bg-azul-negro">
        <Reveal className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="font-cinzel text-3xl text-blanco">
            {TAMANO_LABEL[tamano]}
          </h2>
          <p className="label-ui mt-2 text-sm uppercase tracking-wide text-gris-azul">
            {TAMANO_DETALLE[tamano]}
          </p>
        </Reveal>
      </section>

      {marcas.map((marca) => (
        <MarcaSection
          key={marca}
          marca={marca}
          productos={delTamano}
          staggerKey={staggerKey}
          className={fondoDeMarca(marca)}
        />
      ))}
    </>
  );
}
