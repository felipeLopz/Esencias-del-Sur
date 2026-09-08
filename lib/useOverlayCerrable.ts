"use client";

import { useEffect } from "react";

// Comportamiento compartido por los overlays del sitio (CartDrawer,
// ComparadorModal, Buscador): cerrar con Escape y —opcionalmente— bloquear el
// scroll del body mientras están abiertos.
//
// `bloquearScroll` viene en true por defecto para no cambiar el comportamiento
// de los overlays modales que ya lo usaban. El buscador lo apaga porque es un
// dropdown del Header: bloquear el scroll de la página ahí sería incorrecto.
export function useOverlayCerrable(
  abierto: boolean,
  cerrar: () => void,
  { bloquearScroll = true }: { bloquearScroll?: boolean } = {}
) {
  useEffect(() => {
    if (!abierto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", onKeyDown);

    if (!bloquearScroll) {
      return () => window.removeEventListener("keydown", onKeyDown);
    }

    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = scrollPrevio;
    };
  }, [abierto, cerrar, bloquearScroll]);
}
