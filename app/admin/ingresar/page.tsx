import type { Metadata } from "next";
import FormularioPin from "@/components/FormularioPin";

export const metadata: Metadata = {
  title: "Panel — Esencias del Sur",
  robots: { index: false, follow: false },
};

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const siguiente = next && next.startsWith("/admin") ? next : "/admin";

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-azul-negro px-5 py-10">
      <FormularioPin siguiente={siguiente} />
    </main>
  );
}
