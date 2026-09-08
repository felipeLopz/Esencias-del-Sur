import type { ItemCarrito } from "@/context/CarritoContext";
import { formatearPrecio } from "@/data/productos";
import { formatoLabel } from "./formato";
import { WHATSAPP_NUMERO, normalizarWhatsApp } from "./config";

// Arma el texto plano del pedido para mandar por WhatsApp.
export function construirMensajePedido(
  items: ItemCarrito[],
  total: number
): string {
  const lineas: string[] = ["Hola! Quiero hacer este pedido:", ""];

  for (const { producto, cantidad } of items) {
    const subtotal = producto.precio * cantidad;
    lineas.push(
      `• ${producto.nombre} — ${producto.marca} · ${formatoLabel(
        producto.formato
      )}`,
      `  ${cantidad} × ${formatearPrecio(producto.precio)} = ${formatearPrecio(
        subtotal
      )}`
    );
  }

  lineas.push("", `Total: ${formatearPrecio(total)}`);
  return lineas.join("\n");
}

// Link wa.me con el mensaje URL-encodeado y el número normalizado.
export function linkPedidoWhatsApp(items: ItemCarrito[], total: number): string {
  const numero = normalizarWhatsApp(WHATSAPP_NUMERO);
  const texto = encodeURIComponent(construirMensajePedido(items, total));
  return `https://wa.me/${numero}?text=${texto}`;
}
