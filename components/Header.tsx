import Buscador from "./Buscador";
import LinkConModo from "./LinkConModo";
import ThemeToggle from "./ThemeToggle";
import CartButton from "./CartButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-azul-negro/90 backdrop-blur-sm border-b border-[var(--tarjeta-borde)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <LinkConModo href="/" className="flex shrink-0 flex-col leading-none">
          <span className="font-cinzel text-lg font-600 text-blanco sm:text-xl">
            Esencias del Sur
          </span>
          <span className="label-ui text-[11px] uppercase text-gris-azul">
            Perfumería árabe
          </span>
        </LinkConModo>

        <nav className="label-ui flex items-center gap-3 text-sm sm:gap-6">
          <LinkConModo
            href="/"
            className="nav-link hidden text-blanco/90 hover:text-blanco sm:inline"
          >
            Inicio
          </LinkConModo>
          <LinkConModo
            href="/catalogo"
            className="nav-link text-blanco/90 hover:text-blanco"
          >
            Catálogo
          </LinkConModo>
          <Buscador />
          <ThemeToggle />
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
