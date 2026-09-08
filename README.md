# Esencias del Sur — E-commerce (perfumería árabe)

Sitio de e-commerce hecho con **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4**.
Paleta "Todo en azul", fuentes Cinzel / Cormorant Garamond / EB Garamond.

> El checkout / consulta por **WhatsApp** todavía **no está implementado**. Los botones
> "Consultar" y el botón flotante son placeholders (`href="#"`), listos para conectar
> en una próxima sesión.

## Correr en local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

Otros comandos:

```bash
npm run build   # build de producción
npm run start   # servir el build
```

## Estructura

```
app/
  layout.tsx              # fuentes + metadata global
  globals.css             # paleta de colores y estilos base
  page.tsx                # Home (hero, destacados, catálogo con filtros)
  catalogo/page.tsx       # Catálogo completo
  producto/[slug]/page.tsx# Detalle de producto
components/               # Header, Footer, ProductCard, filtros, botón flotante
data/productos.ts         # ← productos (EDITAR ACÁ)
```

## Agregar / editar productos

Todo vive en [`data/productos.ts`](data/productos.ts). Los productos actuales son
**de ejemplo** (tomados de los mockups) y hay que reemplazarlos por los reales.

Cada producto tiene esta forma:

```ts
{
  id: 10,                          // número único
  slug: "mi-perfume",              // URL: /producto/mi-perfume (sin espacios, en minúsculas)
  nombre: "Mi Perfume",
  categoria: "Oud & Ámbar",        // una de las categorías válidas (ver abajo)
  tamano: "50 ml",
  precio: 68000,                   // número, sin puntos ni símbolo (se formatea solo)
  imagen: "/productos/mi-perfume.jpg", // ver "Imágenes"
  descripcion: "Texto de la fragancia...",
}
```

**Categorías válidas** (definidas en el tipo `Categoria`):
`"Oud & Ámbar"`, `"Floral"`, `"Fresco / Cítrico"`, `"Sets regalo"`.
Para agregar una categoría nueva, sumala al tipo `Categoria` y al array `CATEGORIAS`.

### Imágenes

Los ejemplos usan `picsum.photos` como placeholder. Para imágenes propias:

1. Poné el archivo en `public/productos/` (ej: `public/productos/ambar-real.jpg`).
2. Usá la ruta `"/productos/ambar-real.jpg"` en el campo `imagen`.

Si vas a usar imágenes de otro dominio externo, agregalo en `next.config.mjs`
dentro de `images.remotePatterns`.

## Deploy en Vercel

- **Con GitHub:** subí el repo a GitHub e importalo en https://vercel.com/new.
  Vercel detecta Next.js automáticamente; no hace falta configurar nada.
- **Con CLI:**

```bash
npm i -g vercel
vercel        # deploy de preview
vercel --prod # deploy a producción
```
