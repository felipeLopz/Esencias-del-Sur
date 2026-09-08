import CartButton from "./CartButton";

// Botón flotante — segundo trigger del carrito.
// Mantiene posición / tamaño / bounce de entrada (float-in) de antes; sólo
// cambia el ícono (carrito) y la acción (abre el drawer vía CartButton).
export default function BotonFlotante() {
  return (
    <CartButton
      className="btn-pill btn-primario float-in fixed bottom-6 right-6 z-50 px-5 py-3 shadow-lg shadow-black/40"
      badgeClassName="badge-carrito badge-carrito--invertido"
    />
  );
}
