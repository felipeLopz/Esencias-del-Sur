"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { ingresarConPin } from "@/app/admin/ingresar/actions";

const LARGO_PIN = 6;
const TECLAS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "borrar", "0", "ok"];

/**
 * Teclado numérico para el PIN del panel. Mismo flujo que el organizador de
 * la abuela (al completar los 6 dígitos envía solo), con el estilo de este
 * sitio: Cinzel para el título, EB Garamond para la UI, radios de 16px.
 */
export default function FormularioPin({ siguiente }: { siguiente: string }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const enviar = useCallback(
    (valor: string) => {
      startTransition(async () => {
        try {
          const res = await ingresarConPin(valor, siguiente);
          if (res?.error) {
            setError(res.error);
            setPin("");
          }
          // Si salió bien, el server action redirige y no llegamos acá.
        } catch (err) {
          unstable_rethrow(err);
          setError("No se pudo verificar el PIN. Probá de nuevo.");
          setPin("");
        }
      });
    },
    [siguiente],
  );

  function cambiarPin(valorCrudo: string) {
    if (pendiente) return;
    const limpio = valorCrudo.replace(/\D/g, "").slice(0, LARGO_PIN);
    setError(null);
    setPin(limpio);
    if (limpio.length === LARGO_PIN) enviar(limpio);
  }

  function tocarTecla(tecla: string) {
    if (pendiente) return;
    if (tecla === "borrar") {
      setError(null);
      setPin((actual) => actual.slice(0, -1));
      inputRef.current?.focus();
      return;
    }
    if (tecla === "ok") {
      if (pin.length === LARGO_PIN) enviar(pin);
      return;
    }
    cambiarPin(pin + tecla);
    inputRef.current?.focus();
  }

  return (
    <div className="tarjeta w-full max-w-sm p-6 sm:p-8">
      <h1 className="text-center font-cinzel text-2xl text-blanco">
        Panel de stock
      </h1>
      <p className="mt-2 text-center text-gris-azul">
        Ingresá el PIN de {LARGO_PIN} dígitos.
      </p>

      <label htmlFor="pin" className="sr-only">
        PIN de {LARGO_PIN} dígitos
      </label>
      <input
        ref={inputRef}
        id="pin"
        name="pin"
        type="password"
        inputMode="numeric"
        autoComplete="off"
        maxLength={LARGO_PIN}
        value={pin}
        disabled={pendiente}
        onChange={(e) => cambiarPin(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "pin-error" : undefined}
        className="buscador-input mt-6 text-center text-2xl tracking-[0.5em] disabled:opacity-60"
      />

      {error && (
        <p id="pin-error" role="alert" className="mt-3 text-center text-blanco">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        {TECLAS.map((tecla) => {
          if (tecla === "borrar") {
            return (
              <button
                key={tecla}
                type="button"
                onClick={() => tocarTecla(tecla)}
                disabled={pendiente}
                aria-label="Borrar"
                className="tecla-pin disabled:opacity-40"
              >
                ←
              </button>
            );
          }
          if (tecla === "ok") {
            return (
              <button
                key={tecla}
                type="button"
                onClick={() => tocarTecla(tecla)}
                disabled={pendiente || pin.length !== LARGO_PIN}
                aria-label="Entrar"
                className="tecla-pin tecla-pin--ok disabled:opacity-40"
              >
                {pendiente ? "…" : "OK"}
              </button>
            );
          }
          return (
            <button
              key={tecla}
              type="button"
              onClick={() => tocarTecla(tecla)}
              disabled={pendiente}
              className="tecla-pin disabled:opacity-40"
            >
              {tecla}
            </button>
          );
        })}
      </div>
    </div>
  );
}
