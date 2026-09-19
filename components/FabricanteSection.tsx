import Reveal from "@/components/Reveal";
import MarcaSection from "@/components/MarcaSection";
import {
  FABRICANTE_OTRAS,
  MARCA_OTRAS,
  type Fabricante,
  type Marca,
  type Producto,
} from "@/data/productos";
import { fondoDeFabricante, marcasDeFabricante } from "@/lib/agrupacion";

// Primer nivel de la jerarquía: un bloque por fabricante real (Lattafa, Afnan,
// Armaf...) con un encabezado y debajo sus líneas como sub-secciones
// (MarcaSection). Todo el bloque —encabezado y líneas— comparte el tono que
// `fondoDeFabricante` le asigna al fabricante, así se lee como una unidad y el
// corte visual cae entre fabricantes, no entre líneas.
// Si el fabricante no tiene productos tras los filtros, no renderiza nada.
export default function FabricanteSection({
  fabricante,
  productos,
  staggerKey,
  agotados,
}: {
  fabricante: Fabricante;
  productos: Producto[];
  staggerKey?: string;
  /** Slugs sin stock; se pasa tal cual a cada MarcaSection. */
  agotados?: Set<string>;
}) {
  const delFabricante = productos.filter((p) => p.fabricante === fabricante);
  if (delFabricante.length === 0) return null;

  const marcas = marcasDeFabricante(delFabricante, fabricante);
  const fondo = fondoDeFabricante(fabricante);
  const cantidad = delFabricante.length;

  // La marca paraguas MARCA_OTRAS ("Otras marcas") no se puede rotular así
  // dentro de un fabricante concreto: ahí son productos de esa casa que no
  // forman línea propia. Y dentro del propio bloque "Otras marcas" repetiría el
  // encabezado, así que se rotulan "Sueltos".
  const tituloDeMarca = (marca: Marca): string | undefined => {
    if (marca !== MARCA_OTRAS) return undefined;
    return fabricante === FABRICANTE_OTRAS
      ? "Sueltos"
      : `Otros de ${fabricante}`;
  };

  return (
    <div className={fondo}>
      <section id={`fabricante-${encodeURIComponent(fabricante)}`}>
        <Reveal className="mx-auto max-w-6xl px-5 pt-14 pb-2">
          <h2 className="font-cinzel text-3xl text-blanco">{fabricante}</h2>
          <p className="label-ui mt-2 text-sm uppercase tracking-wide text-gris-azul">
            {cantidad} {cantidad === 1 ? "producto" : "productos"}
            {marcas.length > 1 ? ` · ${marcas.length} líneas` : ""}
          </p>
        </Reveal>
      </section>

      {marcas.map((marca) => (
        <MarcaSection
          key={marca}
          marca={marca}
          titulo={tituloDeMarca(marca)}
          productos={delFabricante}
          staggerKey={staggerKey}
          agotados={agotados}
        />
      ))}
    </div>
  );
}
