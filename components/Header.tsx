import Link from "next/link";
import Buscador from "./Buscador";
import ThemeToggle from "./ThemeToggle";
import CartButton from "./CartButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-azul-negro/90 backdrop-blur-sm border-b border-[var(--tarjeta-borde)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex shrink-0 flex-col leading-none">
          <span className="font-cinzel text-lg font-600 text-blanco sm:text-xl">
            Esencias del Sur
          </span>
          <span className="label-ui text-[11px] uppercase text-gris-azul">
            Perfumería árabe
          </span>
        </Link>

        <nav className="label-ui flex items-center gap-3 text-sm sm:gap-6">
          <Link
            href="/"
            className="nav-link hidden text-blanco/90 hover:text-blanco sm:inline"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="nav-link text-blanco/90 hover:text-blanco"
          >
            Catálogo
          </Link>
          <Link
            href="/#destacados"
            className="nav-link hidden text-blanco/90 hover:text-blanco sm:inline"
          >
            Destacados
          </Link>
          <Buscador />
          <ThemeToggle />
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
