import type { Formato } from "@/data/productos";

// Etiqueta legible para el campo `formato` de un producto.
export function formatoLabel(formato: Formato): string {
  switch (formato) {
    case "tubo_35ml":
      return "Tubo · 35 ml";
    case "grande_50ml":
      return "Grande · 50 ml";
    case "grande_100ml":
      return "Grande · 100 ml";
  }
}
