import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/context/CarritoContext";
import CartDrawer from "@/components/CartDrawer";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${ebGaramond.variable}`}
      >
        <CarritoProvider>
          {children}
          <CartDrawer />
        </CarritoProvider>
      </body>
    </html>
  );
}
