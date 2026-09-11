// Configuración centralizada del negocio.

// Número de WhatsApp al que llegan los pedidos del checkout.
// Formato libre (con o sin espacios / +): se normaliza en `normalizarWhatsApp`.
export const WHATSAPP_NUMERO = "+54 9 261 3900039";

// wa.me exige el número como solo dígitos, con código de país, sin "+" ni espacios.
// Ej: "+54 9 261 1234567" -> "5492611234567"
export function normalizarWhatsApp(numero: string): string {
  return numero.replace(/\D/g, "");
}
