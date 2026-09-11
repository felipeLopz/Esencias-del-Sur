// Bloque 1 — franja fina de promo, arriba de todo el sitio.
// Se monta en el layout raíz, por encima del Header sticky (scrollea con la
// página; el Header se pega arriba y pasa por encima).
export default function BarraPromo() {
  return (
    <div className="border-b border-[var(--tarjeta-borde)] bg-azul-negro">
      <p className="label-ui mx-auto max-w-6xl px-5 py-2 text-center text-[11px] uppercase tracking-wide text-gris-azul">
        Envíos a todo el país · Pedís por WhatsApp
      </p>
    </div>
  );
}
