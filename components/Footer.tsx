import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-azul-negro border-t border-[var(--tarjeta-borde)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-cinzel text-lg text-blanco">Esencias del Sur</p>
          <p className="mt-2 max-w-xs text-gris-azul">
            Fragancias árabes de autor. Oud, ámbar, florales y notas frescas,
            seleccionadas con criterio.
          </p>
        </div>

        <div className="label-ui text-sm">
          <p className="mb-3 uppercase tracking-wide text-gris-azul">Navegar</p>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blanco/90 hover:text-blanco">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/catalogo"
                className="text-blanco/90 hover:text-blanco"
              >
                Catálogo completo
              </Link>
            </li>
          </ul>
        </div>

        <div className="label-ui text-sm">
          <p className="mb-3 uppercase tracking-wide text-gris-azul">
            Contacto
          </p>
          <p className="text-blanco/90">
            El checkout y la consulta por WhatsApp se agregan próximamente.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--tarjeta-borde)]">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-xs text-gris-azul">
          © {new Date().getFullYear()} Esencias del Sur. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
