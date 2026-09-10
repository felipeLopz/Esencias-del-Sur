"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "./ProductImage";
import AgregarAlCarrito from "./AgregarAlCarrito";
import { formatearPrecio, type Producto } from "@/data/productos";
import { tamanoLabel } from "@/lib/agrupacion";

// Cada cuántos ms avanza solo el carrusel.
const INTERVALO_MS = 6000;

// Carrusel de Destacados: UNA tarjeta grande a la vez, centrada, con ancho
// máximo en desktop. Flechas circulares a los costados + dots debajo.
// La lógica de avance/autoplay/teclado no cambió respecto de la versión previa;
// sólo el layout visual de cada slide.
export default function CarruselDestacados({
  productos,
}: {
  productos: Producto[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indiceRef = useRef(0);
  const [indice, setIndice] = useState(0);

  // Autoplay se corta de forma permanente si el usuario navega a mano.
  const [pausadoPorUsuario, setPausadoPorUsuario] = useState(false);
  const [hover, setHover] = useState(false);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducido(mq.matches);
    const onChange = () => setReducido(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const irA = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const total = productos.length;
      const idx = ((i % total) + total) % total;
      indiceRef.current = idx;
      setIndice(idx);
      const slide = track.firstElementChild as HTMLElement | null;
      const ancho = slide?.clientWidth ?? track.clientWidth;
      track.scrollTo({
        left: ancho * idx,
        behavior: reducido ? "auto" : "smooth",
      });
    },
    [productos.length, reducido]
  );

  const prev = () => {
    setPausadoPorUsuario(true);
    irA(indiceRef.current - 1);
  };
  const next = () => {
    setPausadoPorUsuario(true);
    irA(indiceRef.current + 1);
  };
  const irADot = (i: number) => {
    setPausadoPorUsuario(true);
    irA(i);
  };

  // Sincroniza el índice si el usuario hace swipe manual.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const ancho =
      (track.firstElementChild as HTMLElement | null)?.clientWidth || 1;
    const idx = Math.round(track.scrollLeft / ancho);
    indiceRef.current = idx;
    setIndice(idx);
  };

  const autoplayActivo =
    !pausadoPorUsuario && !hover && !reducido && productos.length > 1;

  useEffect(() => {
    if (!autoplayActivo) return;
    const id = window.setInterval(
      () => irA(indiceRef.current + 1),
      INTERVALO_MS
    );
    return () => window.clearInterval(id);
  }, [autoplayActivo, irA]);

  return (
    <div>
      <div className="max-w-xl">
        <h2 className="font-cinzel text-3xl text-blanco">Destacados</h2>
        <p className="mt-2 text-gris-azul">
          Nuestras fragancias más queridas para empezar a descubrir la colección.
        </p>
      </div>

      <div
        className="relative mx-auto mt-10 max-w-md"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Producto anterior"
          className="carrusel-flecha absolute left-1 top-[34%] z-10 -translate-y-1/2 sm:-left-16 sm:top-1/2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="overflow-hidden rounded-2xl">
          <ul
            ref={trackRef}
            onScroll={onScroll}
            onPointerDown={() => setPausadoPorUsuario(true)}
            onFocusCapture={() => setPausadoPorUsuario(true)}
            className={`flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              reducido ? "" : "scroll-smooth"
            }`}
          >
            {productos.map((producto) => (
              <li key={producto.id} className="w-full shrink-0 snap-start">
                <article className="tarjeta flex flex-col overflow-hidden">
                  <Link
                    href={`/producto/${producto.slug}`}
                    className="relative block aspect-square overflow-hidden"
                  >
                    {/* Categoría cuando se conoce; si no, la etiqueta de la
                        sección, para que el badge nunca quede vacío. */}
                    <span className="destacado-badge">
                      {producto.categoria ?? "Destacado"}
                    </span>
                    <ProductImage
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 768px) 90vw, 28rem"
                      className="object-contain"
                    />
                  </Link>

                  <div className="flex flex-col gap-4 p-5">
                    <div>
                      <h3 className="font-cinzel text-xl text-blanco">
                        <Link href={`/producto/${producto.slug}`}>
                          {producto.nombre}
                        </Link>
                      </h3>
                      <p className="label-ui mt-1 text-sm text-gris-azul">
                        {producto.marca} · {tamanoLabel(producto.mililitros)}
                      </p>
                    </div>

                    <p className="font-cinzel text-2xl text-blanco">
                      {formatearPrecio(producto.precio)}
                    </p>

                    <AgregarAlCarrito
                      producto={producto}
                      size="lg"
                      className="w-full justify-center"
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Producto siguiente"
          className="carrusel-flecha absolute right-1 top-[34%] z-10 -translate-y-1/2 sm:-right-16 sm:top-1/2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {productos.map((producto, i) => (
          <button
            key={producto.id}
            type="button"
            onClick={() => irADot(i)}
            aria-label={`Ir a ${producto.nombre}`}
            aria-current={i === indice}
            className="carrusel-dot"
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Producto {indice + 1} de {productos.length}
      </p>
    </div>
  );
}
