"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Tema = "dark" | "light";

const STORAGE_KEY = "esencias-del-sur:tema";

interface ThemeContextValue {
  tema: Tema;
  alternar: () => void;
  // false hasta que el efecto de montaje sincroniza con lo que dejó el script
  // inline; sirve para no parpadear el ícono del toggle en SSR.
  montado: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Tema inicial resuelto por el script inline del layout ANTES de la hidratación
// (localStorage -> prefers-color-scheme -> dark). Acá solo lo leemos de <html>.
function leerTemaAplicado(): Tema {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // El primer render de cliente debe coincidir con el HTML del servidor (dark).
  const [tema, setTema] = useState<Tema>("dark");
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setTema(leerTemaAplicado());
    setMontado(true);
  }, []);

  const alternar = useCallback(() => {
    setTema((prev) => {
      const siguiente: Tema = prev === "dark" ? "light" : "dark";
      const el = document.documentElement;

      // Transición suave de colores: clase transitoria (ver globals.css).
      el.classList.add("theme-cambiando");
      window.setTimeout(() => el.classList.remove("theme-cambiando"), 450);

      el.dataset.theme = siguiente;
      el.style.colorScheme = siguiente;

      try {
        window.localStorage.setItem(STORAGE_KEY, siguiente);
      } catch {
        // Sin persistencia si localStorage falla; el tema vive en memoria.
      }

      return siguiente;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ tema, alternar, montado }),
    [tema, alternar, montado]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return ctx;
}
