/**
 * Sesión del panel /admin: cookie firmada, bloqueo por PIN.
 *
 * Mismo enfoque que el organizador de la abuela: no es un sistema de usuarios,
 * el único objetivo es que no entre cualquiera que adivine la URL. La cookie
 * guarda un vencimiento + una firma HMAC-SHA256 hecha con `SESSION_SECRET`
 * (NO con el PIN), calculada con la Web Crypto API para que funcione igual en
 * el middleware (Edge) y en los server actions (Node).
 *
 * A diferencia de aquel proyecto, acá el bloqueo cubre SOLO /admin: la tienda
 * es pública.
 */

export const NOMBRE_COOKIE = "esencias_admin";
export const DURACION_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

function bufferAHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function firmar(payload: string, secreto: string): Promise<string> {
  const codificador = new TextEncoder();
  const clave = await crypto.subtle.importKey(
    "raw",
    codificador.encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const firma = await crypto.subtle.sign(
    "HMAC",
    clave,
    codificador.encode(payload),
  );
  return bufferAHex(firma);
}

/** Arma el valor de la cookie: vencimiento + firma, separados por un punto. */
export async function crearToken(secreto: string): Promise<string> {
  const vence = Date.now() + DURACION_MS;
  const firma = await firmar(String(vence), secreto);
  return `${vence}.${firma}`;
}

/** ¿La cookie existe, no venció, y la firma coincide con el secreto? */
export async function tokenValido(
  token: string | undefined,
  secreto: string,
): Promise<boolean> {
  if (!token) return false;

  const [venceTexto, firma] = token.split(".");
  if (!venceTexto || !firma) return false;

  const vence = Number(venceTexto);
  if (!Number.isFinite(vence) || Date.now() > vence) return false;

  const firmaEsperada = await firmar(venceTexto, secreto);
  return firma === firmaEsperada;
}
