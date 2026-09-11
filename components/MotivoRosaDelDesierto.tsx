// Bloque 2 — motivo decorativo del hero.
// Versión geométrica simplificada inspirada en una rosa del desierto: anillos
// concéntricos + dos coronas de pétalos en kite. NO es el logo real, es un
// ornamento. Usa currentColor para tomar el color del contenedor (--blanco) y
// juega con opacidades para el degradé hacia --gris-azul.
const PETALO_GRANDE = "M200 200 L222 130 L200 58 L178 130 Z";
const PETALO_CHICO = "M200 200 L214 152 L200 104 L186 152 Z";

const ANGULOS_8 = [0, 45, 90, 135, 180, 225, 270, 315];

export default function MotivoRosaDelDesierto({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      role="presentation"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
    >
      {/* Anillos concéntricos */}
      <circle cx="200" cy="200" r="192" strokeWidth="1" opacity="0.18" />
      <circle cx="200" cy="200" r="158" strokeWidth="1" opacity="0.28" />
      <circle cx="200" cy="200" r="118" strokeWidth="1" opacity="0.16" />

      {/* Marcas finas sobre el anillo exterior */}
      {Array.from({ length: 24 }, (_, i) => i * 15).map((a) => (
        <line
          key={a}
          x1="200"
          y1="14"
          x2="200"
          y2="26"
          strokeWidth="1"
          opacity="0.3"
          transform={`rotate(${a} 200 200)`}
        />
      ))}

      {/* Corona de pétalos grandes */}
      {ANGULOS_8.map((a) => (
        <path
          key={`g${a}`}
          d={PETALO_GRANDE}
          strokeWidth="1.25"
          opacity="0.5"
          transform={`rotate(${a} 200 200)`}
        />
      ))}

      {/* Corona interior, rotada 22.5° para intercalarse */}
      {ANGULOS_8.map((a) => (
        <path
          key={`c${a}`}
          d={PETALO_CHICO}
          strokeWidth="1"
          opacity="0.75"
          transform={`rotate(${a + 22.5} 200 200)`}
        />
      ))}

      {/* Núcleo */}
      <circle cx="200" cy="200" r="30" strokeWidth="1" opacity="0.5" />
      <circle cx="200" cy="200" r="15" strokeWidth="1.25" opacity="0.9" />
      <circle cx="200" cy="200" r="4" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}
