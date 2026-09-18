import type { Metadata } from "next";
import Link from "next/link";
import PanelStock from "@/components/PanelStock";
import { getProductosConStock } from "@/lib/stock";

export const metadata: Metadata = {
  title: "Panel de stock — Esencias del Sur",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const productos = await getProductosConStock();

  return (
    <main className="min-h-[100dvh] bg-azul-negro">
      <div className="mx-auto max-w-4xl px-5 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-cinzel text-3xl text-blanco">Panel de stock</h1>
            <p className="mt-2 max-w-xl text-gris-azul">
              Marcá un producto como agotado y deja de poder agregarse al
              carrito en todo el sitio. Sigue visible en el catálogo.
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
          <PanelStock iniciales={productos} />
        </div>
      </div>
    </main>
  );
}
