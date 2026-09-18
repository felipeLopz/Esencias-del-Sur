import { NextResponse, type NextRequest } from "next/server";
import { NOMBRE_COOKIE, tokenValido } from "@/lib/sesion";

const RUTA_INGRESO = "/admin/ingresar";

/**
 * Bloqueo por PIN del panel. Cubre SOLO /admin/**: toda la tienda (home,
 * catálogo, fichas, carrito) sigue siendo pública y no pasa por acá.
 *
 * La propia pantalla de ingreso queda afuera del chequeo, si no nadie podría
 * loguearse nunca.
 *
 * Va en `proxy.ts`, no en `middleware.ts`: Next 16 deprecó esa convención y
 * la renombró a "proxy" (el build avisa si se usa la vieja).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === RUTA_INGRESO) {
    return NextResponse.next();
  }

  const secreto = process.env.SESSION_SECRET;
  const cookie = request.cookies.get(NOMBRE_COOKIE)?.value;

  if (secreto && (await tokenValido(cookie, secreto))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = RUTA_INGRESO;
  url.search = "";
  if (pathname !== "/admin") url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
