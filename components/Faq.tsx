"use client";

import { useState } from "react";
import { linkConsultaWhatsApp } from "@/lib/whatsapp";

// Bloque "Preguntas frecuentes" de la Home. Acordeón simple: una sola
// pregunta abierta a la vez (abrir otra cierra la anterior) — evita que la
// sección crezca demasiado si alguien va abriendo varias.
interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
  /** Agrega un link "Escribinos por WhatsApp" debajo de la respuesta. */
  conLinkWhatsapp?: boolean;
}

const PREGUNTAS_FRECUENTES: PreguntaFrecuente[] = [
  {
    pregunta: "¿Cómo hago un pedido?",
    respuesta:
      "Elegís tu producto, lo mandás al carrito y hacemos checkout por WhatsApp para coordinar envío o retiro.",
  },
  {
    pregunta: "¿Dónde retiro mi perfume?",
    respuesta:
      "Las fragancias las retirás en Río Cuarto 2341, Dorrego, Guaymallén (avisar con anticipación si venís a retirar).",
  },
  {
    pregunta: "¿Qué significa que un perfume sea G5?",
    respuesta:
      "Un perfume G5 significa que es una réplica o clon de alta calidad de una fragancia original.",
  },
  {
    pregunta: "¿Los perfumes son originales o G5?",
    respuesta:
      "Depende del perfume: hay algunos que son originales y otros G5 (consultanos por WhatsApp).",
    // Única pregunta con CTA: es la que remite a "consultanos por WhatsApp".
    conLinkWhatsapp: true,
  },
  {
    pregunta: "¿Cuáles son las formas de pago?",
    respuesta:
      "Podés abonar en efectivo si venís a retirar, o por transferencia si es con envío. Aceptamos MercadoPago, BruBank, Ualá, Naranja X, entre otras.",
  },
  {
    pregunta: "¿Cuánto tarda en estar listo mi pedido?",
    respuesta:
      "Si el perfume lo tenemos en mano, entre 1 y 2 días. Si hay que encargarlo, te confirmamos el plazo por WhatsApp apenas hacés el pedido.",
  },
];

export default function Faq() {
  // null = todas cerradas. Un solo índice abierto a la vez.
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <div className="grid gap-4">
      {PREGUNTAS_FRECUENTES.map((item, i) => {
        const abiertaAhora = abierta === i;
        const idPregunta = `faq-pregunta-${i}`;
        const idRespuesta = `faq-respuesta-${i}`;

        return (
          <div key={item.pregunta} className="tarjeta overflow-hidden">
            <button
              type="button"
              id={idPregunta}
              onClick={() => setAbierta(abiertaAhora ? null : i)}
              aria-expanded={abiertaAhora}
              aria-controls={idRespuesta}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-cinzel text-lg text-blanco">
                {item.pregunta}
              </span>
              <svg
                className="faq-icono shrink-0 text-blanco"
                data-abierta={abiertaAhora}
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              id={idRespuesta}
              role="region"
              aria-labelledby={idPregunta}
              className="faq-respuesta"
              data-abierta={abiertaAhora}
            >
              {/* El padding va en este div interno, NO en el que tiene
                  overflow-hidden: si el padding vive en el mismo elemento
                  clipeado, ese padding cuenta igual para la altura mínima
                  del truco grid-rows y la fila cerrada nunca llega a 0
                  (quedaba en ~20px de "pb-5", mostrando texto fantasma). */}
              <div className="overflow-hidden">
                <div className="px-5 pb-5">
                  <p className="text-lg leading-relaxed text-gris-azul">
                    {item.respuesta}
                  </p>
                  {item.conLinkWhatsapp && (
                    <a
                      href={linkConsultaWhatsApp()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-ui mt-2 inline-block text-sm text-blanco underline underline-offset-2 transition-colors hover:text-gris-azul"
                    >
                      Escribinos por WhatsApp →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
