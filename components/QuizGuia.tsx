"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type Producto } from "@/data/productos";
import { recomendarProductos, type RespuestasQuiz } from "@/lib/quiz";
import { useOverlayCerrable } from "@/lib/useOverlayCerrable";
import ProductCard from "./ProductCard";

// Bloque 6 de la Home ("¿No sabés cuál elegir?"): el botón "Hacer la guía"
// abre este modal con las 5 preguntas del quiz, una por vez (género, para
// quién, aroma, ocasión, presupuesto). Al responder la última se llama a
// `recomendarProductos` (lib/quiz.ts) y se muestran con ProductCard los
// resultados que califiquen: hasta 3, pero pueden ser menos (o ninguno, y ahí
// va un estado vacío), porque presupuesto y género son filtros duros y nunca
// se rellena con productos que no los cumplan.
// El indicador de progreso y el botón "Atrás" son genéricos
// (usan `PREGUNTAS.length`/`pasoActual`), así que no necesitaron cambios al
// sumar esta pregunta.
//
// Mismo patrón de apertura/cierre que CartDrawer / ComparadorModal: clases
// .modal-overlay / .modal-panel + useOverlayCerrable (Escape + scroll lock).
//
// A diferencia de esos dos (montados directo en layout.tsx), este botón vive
// dentro de un <Reveal> de la Home. `.reveal` anima con `transform`, y
// CUALQUIER transform en un ancestro —incluso translateY(0) ya visible—
// crea un nuevo containing block para los descendientes `position: fixed`,
// rompiendo el posicionamiento del overlay/panel contra el viewport real
// (se veía mal ubicado/recortado, superpuesto con "Destacados del mes").
// Portamos el overlay+panel a document.body para que queden SIEMPRE
// posicionados contra el viewport, sin importar dónde se monte el botón.

interface Pregunta {
  id: keyof RespuestasQuiz;
  titulo: string;
  opciones: { label: string; valor: string }[];
}

const PREGUNTAS: Pregunta[] = [
  {
    id: "genero",
    titulo: "¿Buscás para hombre, mujer, o no importa?",
    opciones: [
      { label: "Hombre", valor: "hombre" },
      { label: "Mujer", valor: "mujer" },
      { label: "Unisex", valor: "no_importa" },
    ],
  },
  {
    id: "paraQuien",
    titulo: "¿Para quién es?",
    opciones: [
      { label: "Para mí", valor: "mi" },
      { label: "Para regalar", valor: "regalo" },
    ],
  },
  {
    id: "aroma",
    titulo: "¿Qué tipo de aroma buscás?",
    opciones: [
      { label: "Dulce / gourmand", valor: "dulce" },
      { label: "Fresco / cítrico", valor: "fresco" },
      { label: "Amaderado / oud", valor: "amaderado" },
      { label: "Floral", valor: "floral" },
      { label: "No sé, sorprendeme", valor: "sorprendeme" },
    ],
  },
  {
    id: "ocasion",
    titulo: "¿Para qué ocasión?",
    opciones: [
      { label: "Uso diario", valor: "diario" },
      { label: "Salidas de noche", valor: "noche" },
    ],
  },
  {
    id: "presupuesto",
    titulo: "¿Presupuesto?",
    opciones: [
      { label: "Hasta $30.000", valor: "hasta30" },
      { label: "$30.000 - $50.000", valor: "30a50" },
      { label: "Más de $50.000", valor: "mas50" },
    ],
  },
];

export default function QuizGuia() {
  const [abierto, setAbierto] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Partial<RespuestasQuiz>>({});
  const [resultados, setResultados] = useState<Producto[] | null>(null);

  // document.body no existe en el render del servidor: el portal recién se
  // arma después de montar en el cliente.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const cerrar = () => setAbierto(false);
  useOverlayCerrable(abierto, cerrar);

  function reiniciar() {
    setPasoActual(0);
    setRespuestas({});
    setResultados(null);
  }

  function abrir() {
    reiniciar();
    setAbierto(true);
  }

  function elegirOpcion(id: keyof RespuestasQuiz, valor: string) {
    const nuevas = { ...respuestas, [id]: valor } as Partial<RespuestasQuiz>;
    setRespuestas(nuevas);

    if (pasoActual < PREGUNTAS.length - 1) {
      setPasoActual((p) => p + 1);
    } else {
      // Ya tenemos las 4 respuestas: calculamos la recomendación.
      setResultados(recomendarProductos(nuevas as RespuestasQuiz));
    }
  }

  function irAtras() {
    setPasoActual((p) => Math.max(0, p - 1));
  }

  const preguntaActual = PREGUNTAS[pasoActual];

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="btn-pill btn-fill label-ui px-8 py-3 text-base"
      >
        Hacer la guía
      </button>

      {montado &&
        createPortal(
          <>
            <div
              className="modal-overlay"
              data-abierto={abierto}
              onClick={cerrar}
              aria-hidden="true"
            />

            <div
              className="modal-panel modal-panel--quiz"
              data-abierto={abierto}
              role="dialog"
              aria-modal="true"
              aria-label="Guía para elegir tu perfume"
            >
              <header className="flex items-center justify-between border-b border-[var(--tarjeta-borde)] px-5 py-4">
                <p className="font-cinzel text-lg text-blanco">
                  Encontrá tu perfume
                </p>
                <button
                  type="button"
                  onClick={cerrar}
                  className="label-ui text-sm text-gris-azul transition-colors hover:text-blanco"
                >
                  Cerrar ✕
                </button>
              </header>

              <div className="flex-1 overflow-auto px-6 py-8">
                {resultados ? (
                  <div key="resultados" className="quiz-paso-in">
                    <h3 className="text-center font-cinzel text-2xl text-blanco">
                      {resultados.length > 0
                        ? "Tu selección"
                        : "No encontramos coincidencias"}
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-center text-gris-azul">
                      {resultados.length > 0
                        ? "Según tus respuestas, estos son los perfumes que más se ajustan."
                        : "No encontramos perfumes en ese presupuesto y género. Probá ampliando el presupuesto o eligiendo Unisex."}
                    </p>

                    {resultados.length > 0 && (
                      <div className="mt-8 grid gap-5 sm:grid-cols-3">
                        {resultados.map((producto) => (
                          <ProductCard key={producto.id} producto={producto} />
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={reiniciar}
                        className="btn-pill btn-secundario label-ui px-8 py-3 text-base"
                      >
                        Volver a empezar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div key={pasoActual} className="quiz-paso-in mx-auto max-w-md">
                    <p className="label-ui text-center text-xs uppercase tracking-wide text-gris-azul">
                      Pregunta {pasoActual + 1} de {PREGUNTAS.length}
                    </p>
                    <div className="mt-3 flex justify-center gap-2">
                      {PREGUNTAS.map((p, i) => (
                        <span
                          key={p.id}
                          className="carrusel-dot"
                          aria-current={i === pasoActual}
                        />
                      ))}
                    </div>

                    <h3 className="mt-6 text-center font-cinzel text-2xl text-blanco">
                      {preguntaActual.titulo}
                    </h3>

                    <div className="mt-8 grid gap-3">
                      {preguntaActual.opciones.map((opcion) => (
                        <button
                          key={opcion.valor}
                          type="button"
                          onClick={() =>
                            elegirOpcion(preguntaActual.id, opcion.valor)
                          }
                          className="quiz-opcion"
                        >
                          {opcion.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 min-h-[20px]">
                      {pasoActual > 0 && (
                        <button
                          type="button"
                          onClick={irAtras}
                          className="label-ui text-sm text-gris-azul underline underline-offset-2 transition-colors hover:text-blanco"
                        >
                          ← Atrás
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
