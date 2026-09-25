import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/context/CarritoContext";
import { ComparadorProvider } from "@/context/ComparadorContext";
import { ModoCatalogoProvider } from "@/context/ModoCatalogoContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MODOS_CATALOGO_VISIBLE } from "@/lib/config";
import BarraPromo from "@/components/BarraPromo";
import CartDrawer from "@/components/CartDrawer";
import BarraComparacion from "@/components/BarraComparacion";
import ComparadorModal from "@/components/ComparadorModal";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-eb-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Esencias del Sur — Perfumería árabe",
  description:
    "Fragancias árabes de autor: oud, ámbar, florales y notas frescas. Perfumería de nicho con estilo.",
};

// Resuelve el tema ANTES de pintar para evitar el flash: localStorage guardado
// -> preferencia del sistema -> dark. Se ejecuta como script bloqueante.
const scriptTema = `(function(){try{var k="esencias-del-sur:tema";var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");var e=document.documentElement;e.dataset.theme=t;e.style.colorScheme=t;}catch(err){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${ebGaramond.variable}`}
      >
        <ThemeProvider>
          <CarritoProvider>
            <ComparadorProvider>
              <BarraPromo />
              {/* Modo de catálogo (?modo=) para toda la app: páginas, modal de
                  producto, carrito y comparador. Trae su propio <Suspense>
                  (ver context/ModoCatalogoContext.tsx). */}
              <ModoCatalogoProvider modosVisibles={MODOS_CATALOGO_VISIBLE}>
                {children}
                {modal}
                <CartDrawer />
                <BarraComparacion />
                <ComparadorModal />
              </ModoCatalogoProvider>
            </ComparadorProvider>
          </CarritoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
