import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LinkConModo from "@/components/LinkConModo";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-azul-negro">
        <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center">
          <h1 className="font-cinzel text-4xl text-blanco">
            Página no encontrada
          </h1>
          <p className="mt-4 text-gris-azul">
            El producto o la página que buscás no existe.
          </p>
          <LinkConModo
            href="/"
            className="btn-pill btn-primario label-ui mt-8 px-8 py-3"
          >
            Volver al inicio
          </LinkConModo>
        </div>
      </main>
      <Footer />
    </>
  );
}
