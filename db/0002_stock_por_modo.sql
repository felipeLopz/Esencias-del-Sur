-- ============================================================================
-- STOCK POR MODO DE CATÁLOGO (g5 / original)
-- ----------------------------------------------------------------------------
-- El mismo perfume puede estar disponible en G5 y agotado en Original, o al
-- revés. Se modela con una columna más, no con una clave compuesta
-- (slug, modo), por una razón concreta: la base la comparte producción, y la
-- migración corre ANTES de desplegar el código nuevo. Con esta forma el código
-- que ya está en producción sigue andando sin cambios:
--   - `SELECT slug, disponible` sigue devolviendo una fila por slug;
--   - el `ON CONFLICT (slug)` del panel /admin sigue teniendo su PK.
-- Una clave compuesta obligaba a sacar la PK de `slug` y rompía las dos cosas
-- en el mismo momento en que se aplicaba.
--
-- Semántica:
--   - `disponible`          -> stock del modo G5 (lo que fue siempre).
--   - `disponible_original` -> stock del modo Original. NULL = sin dato, y se
--     trata igual que "sin fila" en G5: disponible. Los productos que no se
--     venden en modo Original quedan en NULL; no necesitan valor propio.
--
-- Es aditiva e idempotente (IF NOT EXISTS). Agregar una columna nullable sin
-- default en Postgres no reescribe la tabla: los datos existentes quedan tal
-- cual. Cada statement termina en `;` al final de línea: scripts/stock-seed.mts
-- los separa así, porque el driver HTTP de Neon ejecuta un statement por query.
-- ============================================================================

ALTER TABLE productos_stock
  ADD COLUMN IF NOT EXISTS disponible_original boolean;

COMMENT ON COLUMN productos_stock.disponible IS
  'Stock del modo G5. true = disponible.';

COMMENT ON COLUMN productos_stock.disponible_original IS
  'Stock del modo Original. NULL = sin dato (se considera disponible).';
