-- ============================================================================
-- STOCK POR PRODUCTO
-- ----------------------------------------------------------------------------
-- Única tabla del proyecto. Guarda SOLO el estado de disponibilidad: el resto
-- del producto (nombre, marca, precio, descripción, imagen, género, categoría)
-- sigue viviendo en data/productos.ts, que es estático y se versiona en git.
--
-- La clave es el `slug`, que ya es único en los 48 productos y es lo que usa
-- el sitio para rutear (/producto/<slug>). Si un día se agrega un producto
-- nuevo a productos.ts, correr `npm run stock:seed` lo inserta acá en
-- disponible = true sin tocar los que ya estaban.
-- ============================================================================

CREATE TABLE IF NOT EXISTS productos_stock (
  slug           text PRIMARY KEY,
  disponible     boolean NOT NULL DEFAULT true,
  actualizado_at timestamptz NOT NULL DEFAULT now()
);
