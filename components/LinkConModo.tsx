"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useModoCatalogo } from "@/context/ModoCatalogoContext";

// <Link> interno que conserva el `?modo=` de la URL actual (si lo hay). Sin
// modo en la URL (flag apagado, o primera navegación) el href queda intacto,
// idéntico a un <Link> común. Es cliente porque lee el modo del context; se
// puede usar igual desde server components (Header, Footer, fichas, Home).
export default function LinkConModo({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { conModo } = useModoCatalogo();
  return <Link href={conModo(href)} {...props} />;
}
