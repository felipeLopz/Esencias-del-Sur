import type { Metadata } from "next";
import Link from "next/link";
import PanelStock from "@/components/PanelStock";
import { getDisponibilidad, getProductosConStock } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Panel de stock — Esencias del Sur",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Los 48 productos (vista G5, con su stock G5) y aparte el stock Original de
  // cada slug. El stock es independiente por modo: se puede cargar el Original
  // de un perfume antes de que tenga precio Original. Sin dato = disponible.
  const productos = await getProductosConStock("g5");
  const stockOriginal = await getDisponibilidad("original");
  const disponiblesOriginal = Object.fromEntries(
    productos.map((p) => [p.slug, stockOriginal.get(p.slug) ?? true]),
  );

  return (
    <main className="min-h-[100dvh] bg-azul-negro">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-cinzel text-3xl text-blanco">Panel de stock</h1>
            <p className="mt-2 max-w-xl text-gris-azul">
              Marcá un producto como agotado y deja de poder agregarse al
              carrito en todo el sitio. Sigue visible en el catálogo. Cada
              modo (G5 y Original) tiene su propio stock.
            </p>
          </div>
          <Link
            href="/"
            className="nav-link label-ui shrink-0 text-sm text-blanco/90 hover:text-blanco"
          >
            ← Ver la tienda
          </Link>
        </div>

        <div className="mt-10">
          <PanelStock
            iniciales={productos}
            inicialesOriginal={disponiblesOriginal}
          />
        </div>
      </div>
    </main>
  );
}
