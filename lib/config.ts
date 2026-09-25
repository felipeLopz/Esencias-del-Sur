// Configuración centralizada del negocio.

// Número de WhatsApp al que llegan los pedidos del checkout.
// Formato libre (con o sin espacios / +): se normaliza en `normalizarWhatsApp`.
export const WHATSAPP_NUMERO = "+54 9 261 3900039";

// Modos de catálogo G5 / Original (ver lib/catalogo.ts).
//
// Controla SOLO si la elección de modo es visible: si `/catalogo` sin modo
// pregunta "¿Original o G5?" y si los puntos de entrada (nav, botones, cards de
// la Home) ofrecen la opción. Apagado (default), el sitio se comporta como
// siempre: sin modo en la URL = G5. Las URLs directas con `?modo=original`
// funcionan con el flag prendido o apagado: el flag oculta, no bloquea.
//
// Se prende con la variable de entorno de servidor MODOS_CATALOGO_VISIBLE=true
// (en Vercel: Settings -> Environment Variables; en local: .env.local). Es
// "de servidor" a propósito (sin prefijo NEXT_PUBLIC_): no queda horneada en el
// JS del navegador. Se prende o apaga cambiando la variable, sin tocar código;
// en Vercel el cambio de una variable aplica recién en el próximo deploy
// (alcanza con "Redeploy" del último, sin commit nuevo).
//
// OJO: solo tiene valor real en código de servidor (páginas, server
// components, server actions). Este archivo también lo importan componentes
// cliente (vía lib/whatsapp.ts), y en el navegador `process.env` de una
// variable sin NEXT_PUBLIC_ es undefined, o sea `false`. Si un componente
// cliente necesita saberlo, que se lo pase como prop la página que lo monta.
export const MODOS_CATALOGO_VISIBLE =
  process.env.MODOS_CATALOGO_VISIBLE === "true";

// wa.me exige el número como solo dígitos, con código de país, sin "+" ni espacios.
// Ej: "+54 9 261 1234567" -> "5492611234567"
export function normalizarWhatsApp(numero: string): string {
  return numero.replace(/\D/g, "");
}
