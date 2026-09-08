// Botón flotante — PLACEHOLDER.
// Todavía sin funcionalidad de WhatsApp (href="#"). Se conecta en otra sesión.
export default function BotonFlotante() {
  return (
    <a
      href="#"
      aria-label="Consultar (próximamente)"
      className="btn-pill btn-primario label-ui float-in fixed bottom-6 right-6 z-50 gap-2 px-5 py-3 text-sm shadow-lg shadow-black/40"
    >
      <span aria-hidden>💬</span>
      Consultar
    </a>
  );
}
