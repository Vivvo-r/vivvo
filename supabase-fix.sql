-- ============================================
-- COMANDOS PARA ARREGLAR LA TABLA BUILDINGS
-- ============================================
-- Ejecuta estos comandos UNO POR UNO en tu Supabase SQL Editor

-- 1. AGREGAR LA COLUMNA CORREGIMIENTO
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS corregimiento text;

-- 2. COPIAR DATOS DE NEIGHBORHOOD A CORREGIMIENTO (si tienes datos existentes)
UPDATE buildings SET corregimiento = neighborhood WHERE corregimiento IS NULL;

-- 3. ELIMINAR LA COLUMNA NEIGHBORHOOD
ALTER TABLE buildings DROP COLUMN IF EXISTS neighborhood;

-- 4. CREAR ÍNDICE PARA CORREGIMIENTO
CREATE INDEX IF NOT EXISTS idx_buildings_corregimiento ON buildings(corregimiento);

-- 5. AGREGAR CAMPOS DE CONTEO
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS elevator_count integer;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS pool_count integer;

-- 6. VERIFICAR LA ESTRUCTURA (opcional - solo para verificar)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'buildings' 
ORDER BY ordinal_position;