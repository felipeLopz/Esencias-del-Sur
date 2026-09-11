// Bloque 3 — franja con scroll horizontal infinito.
// El track lleva el contenido DUPLICADO y se anima de 0 a -50%, así el loop
// es continuo. Con prefers-reduced-motion la animación se apaga en globals.css
// y queda la primera copia visible, estática.
const MENSAJES = [
  "Retirás en Guaymallén y Godoy Cruz",
  "Con encargo",
  "Pedís por WhatsApp",
  "Perfumes árabes, G5 y originales",
];

function Grupo({ oculto = false }: { oculto?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={oculto || undefined}>
      {MENSAJES.map((m) => (
        <span key={m} className="flex shrink-0 items-center">
          <span className="label-ui px-6 text-sm uppercase tracking-wide text-blanco">
            {m}
          </span>
          <span className="marquee-punto" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="marquee border-y border-[var(--tarjeta-borde)] bg-azul-med py-3">
      <div className="marquee-track">
        <Grupo />
        {/* Segunda copia: sólo para que el loop no corte. */}
        <Grupo oculto />
      </div>
    </section>
  );
}
