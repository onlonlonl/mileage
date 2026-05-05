-- Mileage · setup.sql
-- Run this in Supabase SQL Editor or via MCP execute_sql

CREATE TABLE mileage_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  purchased_at date NOT NULL,
  scene text,
  for_lux boolean DEFAULT false,
  lux_name text,
  lux_tags text[] DEFAULT '{}',
  lux_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS open (personal tool)
ALTER TABLE mileage_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON mileage_items FOR ALL USING (true) WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_mileage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mileage_items_updated_at
  BEFORE UPDATE ON mileage_items
  FOR EACH ROW
  EXECUTE FUNCTION update_mileage_updated_at();
