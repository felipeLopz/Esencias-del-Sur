"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Producto } from "@/data/productos";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextValue {
  items: ItemCarrito[];
  total: number;
  cantidadTotal: number;
  hidratado: boolean;
  agregar: (producto: Producto, cantidad?: number) => void;
  quitar: (id: number) => void;
  actualizarCantidad: (id: number, cantidad: number) => void;
  vaciar: () => void;
  cantidadDe: (id: number) => number;
  drawerAbierto: boolean;
  abrirDrawer: () => void;
  cerrarDrawer: () => void;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

const STORAGE_KEY = "esencias-del-sur:carrito";

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial vacío para que SSR y el primer render de cliente coincidan.
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [hidratado, setHidratado] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  // Carga desde localStorage recién en el cliente, después del mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as ItemCarrito[]);
      }
    } catch {
      // localStorage no disponible o JSON inválido — se arranca vacío.
    }
    setHidratado(true);
  }, []);

  // Persiste en cada cambio, solo después de hidratar (para no pisar con []).
  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Sin persistencia si localStorage falla; el carrito sigue en memoria.
    }
  }, [items, hidratado]);

  const agregar = useCallback((producto: Producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
  }, []);

  const quitar = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== id));
  }, []);

  const actualizarCantidad = useCallback((id: number, cantidad: number) => {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((i) => i.producto.id !== id)
        : prev.map((i) => (i.producto.id === id ? { ...i, cantidad } : i))
    );
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const abrirDrawer = useCallback(() => setDrawerAbierto(true), []);
  const cerrarDrawer = useCallback(() => setDrawerAbierto(false), []);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0),
    [items]
  );

  const cantidadTotal = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  );

  const cantidadDe = useCallback(
    (id: number) => items.find((i) => i.producto.id === id)?.cantidad ?? 0,
    [items]
  );

  const value = useMemo<CarritoContextValue>(
    () => ({
      items,
      total,
      cantidadTotal,
      hidratado,
      agregar,
      quitar,
      actualizarCantidad,
      vaciar,
      cantidadDe,
      drawerAbierto,
      abrirDrawer,
      cerrarDrawer,
    }),
    [
      items,
      total,
      cantidadTotal,
      hidratado,
      agregar,
      quitar,
      actualizarCantidad,
      vaciar,
      cantidadDe,
      drawerAbierto,
      abrirDrawer,
      cerrarDrawer,
    ]
  );

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito(): CarritoContextValue {
  const ctx = useContext(CarritoContext);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return ctx;
}
