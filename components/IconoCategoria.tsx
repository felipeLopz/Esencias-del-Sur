// Bloque 4 — íconos lineales de las tarjetas "¿Qué estás buscando?".
// Mismo estilo que el resto del sitio: 24x24, stroke currentColor, 1.5.
export type IconoCategoriaNombre =
  | "frasco-grande"
  | "frasco-chico"
  | "oferta"
  | "regalo"
  | "original"
  | "novedad";

const TRAZOS: Record<IconoCategoriaNombre, React.ReactNode> = {
  "frasco-grande": (
    <>
      <rect x="6" y="8" width="12" height="13" rx="2" />
      <rect x="10" y="3" width="4" height="3" rx="0.5" />
      <path d="M11 6h2v2h-2z" />
    </>
  ),
  "frasco-chico": (
    <>
      <rect x="7" y="12" width="10" height="9" rx="2" />
      <rect x="10" y="7" width="4" height="3" rx="0.5" />
      <path d="M11 10h2v2h-2z" />
    </>
  ),
  oferta: (
    <>
      <path d="m20.5 13.5-7 7a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 11.9V5a2 2 0 0 1 2-2h6.9a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.7Z" />
      <circle cx="7.6" cy="7.6" r="1.2" />
    </>
  ),
  regalo: (
    <>
      <rect x="3" y="9.5" width="18" height="11.5" rx="1.5" />
      <path d="M3 13.5h18M12 9.5V21" />
      <path d="M12 9.5S9.6 9.5 8.6 8.5a2 2 0 1 1 3.4-2c1 1 0 3 0 3Z" />
      <path d="M12 9.5s2.4 0 3.4-1a2 2 0 1 0-3.4-2c-1 1 0 3 0 3Z" />
    </>
  ),
  original: (
    <>
      <circle cx="12" cy="9.5" r="6" />
      <path d="m9.6 9.6 1.8 1.8 3.5-3.4" />
      <path d="m8.6 14.8-1.3 5.4 4.7-2.4 4.7 2.4-1.3-5.4" />
    </>
  ),
  novedad: (
    <>
      <path d="M11 3.5 12.8 8.7 18 10.5 12.8 12.3 11 17.5 9.2 12.3 4 10.5 9.2 8.7Z" />
      <path d="M18.4 16.4 19 18.2 20.8 18.8 19 19.4 18.4 21.2 17.8 19.4 16 18.8 17.8 18.2Z" />
    </>
  ),
};

export default function IconoCategoria({
  nombre,
  className = "",
}: {
  nombre: IconoCategoriaNombre;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
