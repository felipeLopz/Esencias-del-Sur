import type { ItemCarrito } from "@/context/CarritoContext";
import { formatearPrecio } from "@/data/productos";
import { MODO_CORTO, debeMostrarModo, presentacionLabel } from "./catalogo";
import { WHATSAPP_NUMERO, normalizarWhatsApp } from "./config";

interface OpcionesPedido {
  /**
   * Valor de MODOS_CATALOGO_VISIBLE. Con los modos visibles cada línea dice su
   * modo (G5 / Original). Ocultos, solo se agrega si hay algo que no es G5:
   * un pedido todo G5 sale igual que antes de existir los modos.
   */
  modosVisibles?: boolean;
}

// Arma el texto plano del pedido para mandar por WhatsApp. Cada línea dice la
// presentación ("100 ml" / "Decant 5 ml") y, si corresponde, el modo.
export function construirMensajePedido(
  items: ItemCarrito[],
  total: number,
  { modosVisibles = false }: OpcionesPedido = {}
): string {
  const lineas: string[] = ["Hola! Quiero hacer este pedido:", ""];
  const mostrarModo = debeMostrarModo(
    items.map((i) => i.producto),
    modosVisibles
  );

  for (const { producto, cantidad } of items) {
    const subtotal = producto.precio * cantidad;
    const modo = mostrarModo ? ` · ${MODO_CORTO[producto.modo ?? "g5"]}` : "";
    lineas.push(
      `• ${producto.nombre} — ${producto.marca} · ${presentacionLabel(producto)}${modo}`,
      `  ${cantidad} × ${formatearPrecio(producto.precio)} = ${formatearPrecio(
        subtotal
      )}`
    );
  }

  lineas.push("", `Total: ${formatearPrecio(total)}`);
  return lineas.join("\n");
}

// Link wa.me con el mensaje URL-encodeado y el número normalizado.
export function linkPedidoWhatsApp(
  items: ItemCarrito[],
  total: number,
  opciones: OpcionesPedido = {}
): string {
  const numero = normalizarWhatsApp(WHATSAPP_NUMERO);
  const texto = encodeURIComponent(
    construirMensajePedido(items, total, opciones)
  );
  return `https://wa.me/${numero}?text=${texto}`;
}

// Consulta genérica (hero, banner de la Home). Sin carrito de por medio.
export const CONSULTA_WHATSAPP = "Hola, quiero hacer una consulta";

export function linkConsultaWhatsApp(
  mensaje: string = CONSULTA_WHATSAPP
): string {
  const numero = normalizarWhatsApp(WHATSAPP_NUMERO);
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
