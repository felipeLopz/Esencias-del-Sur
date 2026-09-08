"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Producto } from "@/data/productos";

export const MAX_COMPARAR = 3;

interface ComparadorContextValue {
  seleccionados: Producto[];
  maximo: number;
  lleno: boolean;
  estaSeleccionado: (id: number) => boolean;
  agregar: (producto: Producto) => void;
  quitar: (id: number) => void;
  alternar: (producto: Producto) => void;
  limpiar: () => void;
  modalAbierto: boolean;
  abrirModal: () => void;
  cerrarModal: () => void;
}

const ComparadorContext = createContext<ComparadorContextValue | null>(null);

// Selección de comparación. A diferencia del carrito, NO se persiste en
// localStorage: es una sesión puntual que se resetea al recargar.
export function ComparadorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seleccionados, setSeleccionados] = useState<Producto[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModal = useCallback(() => setModalAbierto(true), []);
  const cerrarModal = useCallback(() => setModalAbierto(false), []);

  const estaSeleccionado = useCallback(
    (id: number) => seleccionados.some((p) => p.id === id),
    [seleccionados]
  );

  const agregar = useCallback((producto: Producto) => {
    setSeleccionados((prev) => {
      if (prev.some((p) => p.id === producto.id)) return prev;
      if (prev.length >= MAX_COMPARAR) return prev; // tope: se ignora el 4to
      return [...prev, producto];
    });
  }, []);

  const quitar = useCallback((id: number) => {
    setSeleccionados((prev) => {
      const siguiente = prev.filter((p) => p.id !== id);
      // Si se vació desde el modal, no tiene sentido dejarlo abierto.
      if (siguiente.length === 0) setModalAbierto(false);
      return siguiente;
    });
  }, []);

  const alternar = useCallback(
    (producto: Producto) => {
      if (seleccionados.some((p) => p.id === producto.id)) {
        quitar(producto.id);
      } else {
        agregar(producto);
      }
    },
    [seleccionados, agregar, quitar]
  );

  const limpiar = useCallback(() => {
    setSeleccionados([]);
    setModalAbierto(false);
  }, []);

  const value = useMemo<ComparadorContextValue>(
    () => ({
      seleccionados,
      maximo: MAX_COMPARAR,
      lleno: seleccionados.length >= MAX_COMPARAR,
      estaSeleccionado,
      agregar,
      quitar,
      alternar,
      limpiar,
      modalAbierto,
      abrirModal,
      cerrarModal,
    }),
    [
      seleccionados,
      estaSeleccionado,
      agregar,
      quitar,
      alternar,
      limpiar,
      modalAbierto,
      abrirModal,
      cerrarModal,
    ]
  );

  return (
    <ComparadorContext.Provider value={value}>
      {children}
    </ComparadorContext.Provider>
  );
}

export function useComparador(): ComparadorContextValue {
  const ctx = useContext(ComparadorContext);
  if (!ctx) {
    throw new Error("useComparador debe usarse dentro de <ComparadorProvider>");
  }
  return ctx;
}
