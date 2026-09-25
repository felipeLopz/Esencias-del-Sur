"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { formatearPrecio } from "@/data/productos";
import { useModoCatalogo } from "@/context/ModoCatalogoContext";
import { productosParaModo } from "@/lib/catalogo";
import { useOverlayCerrable } from "@/lib/useOverlayCerrable";
import ProductImage from "./ProductImage";

// Normaliza para comparar sin acentos ni mayúsculas: "Ámbar" -> "ambar".
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Buscador del Header. Sin backend: filtra en memoria los productos del modo
// activo (?modo=, ver ModoCatalogoContext) por nombre y marca con includes().
// Sin modo elegido busca en G5, lo mismo que vendió siempre la web.
// El panel se abre debajo de la barra del Header (absolute + top-full sobre el
// <header> sticky) para no alterar el layout de logo / nav / carrito.
export default function Buscador() {
  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState("");
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cerrar = useCallback(() => {
    setAbierto(false);
    setConsulta("");
  }, []);

  // Escape, sin bloquear el scroll de la página (es un dropdown, no un modal).
  useOverlayCerrable(abierto, cerrar, { bloquearScroll: false });

  // Click / tap afuera del buscador.
  useEffect(() => {
    if (!abierto) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) cerrar();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [abierto, cerrar]);

  // Foco en el input al abrir.
  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  const { modo, conModo } = useModoCatalogo();
  const productos = productosParaModo(modo ?? "g5");

  const termino = normalizar(consulta.trim());

  const resultados = useMemo(() => {
    if (!termino) return [];
    return productos.filter(
      (p) =>
        normalizar(p.nombre).includes(termino) ||
        normalizar(p.marca).includes(termino)
    );
  }, [termino, productos]);

  return (
    <div ref={contenedorRef}>
      <button
        type="button"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        aria-label={abierto ? "Cerrar búsqueda" : "Buscar productos"}
        aria-expanded={abierto}
        className="inline-flex items-center text-blanco/90 transition-colors hover:text-blanco"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {abierto && (
        <div className="buscador-panel absolute inset-x-0 top-full">
          <div className="mx-auto max-w-6xl px-5 py-4">
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              autoComplete="off"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Buscar por nombre o marca…"
              aria-label="Buscar productos por nombre o marca"
              className="buscador-input"
            />

            {termino !== "" &&
              (resultados.length === 0 ? (
                <p className="mt-4 text-gris-azul">
                  No encontramos resultados para “{consulta.trim()}”.
                </p>
              ) : (
                <ul className="buscador-resultados mt-3" role="list">
                  {resultados.map((producto) => (
                    <li key={producto.id}>
                      <Link
                        href={conModo(`/producto/${producto.slug}`)}
                        onClick={cerrar}
                        className="buscador-resultado"
                      >
                        <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg border border-[var(--tarjeta-borde)]">
                          <ProductImage
                            src={producto.imagen}
                            alt={producto.nombre}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-cinzel text-base text-blanco">
                            {producto.nombre}
                          </span>
                          <span className="label-ui block text-[11px] uppercase tracking-wide text-gris-azul">
                            {producto.marca}
                          </span>
                        </span>

                        <span className="label-ui shrink-0 text-sm text-blanco">
                          {formatearPrecio(producto.precio)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
