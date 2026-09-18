"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DURACION_MS, NOMBRE_COOKIE, crearToken } from "@/lib/sesion";

type ResultadoIngreso = { error: string } | undefined;

/**
 * Verifica el PIN contra `APP_PIN`. Si coincide, deja una cookie de sesión
 * httpOnly válida por 30 días y redirige al panel. Si no, devuelve un error.
 */
export async function ingresarConPin(
  pin: string,
  siguiente: string,
): Promise<ResultadoIngreso> {
  const pinCorrecto = process.env.APP_PIN;
  const secreto = process.env.SESSION_SECRET;

  if (!pinCorrecto || !secreto) {
    return { error: "El panel no está configurado (falta APP_PIN o SESSION_SECRET)." };
  }

  if (pin !== pinCorrecto) {
    return { error: "PIN incorrecto, probá de nuevo." };
  }

  const token = await crearToken(secreto);
  const jar = await cookies();
  jar.set(NOMBRE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(DURACION_MS / 1000),
    path: "/",
  });

  // Nunca redirigir fuera del panel: solo rutas propias del admin.
  redirect(siguiente.startsWith("/admin") ? siguiente : "/admin");
}
