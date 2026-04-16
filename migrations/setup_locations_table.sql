-- Create job_locations table for configurable job location options
CREATE TABLE IF NOT EXISTS job_locations (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 999,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial locations
INSERT INTO job_locations (name, is_active, sort_order) VALUES
  ('Singapore',           true, 1),
  ('Johor, Malaysia',     true, 2),
  ('Penang, Malaysia',    true, 3),
  ('Shanghai, China',     true, 4),
  ('Chuzhou, China',      true, 5),
  ('Guangzhou, China',    true, 6),
  ('Suzhou, China',       true, 7),
  ('Tianjin, China',      true, 8),
  ('Zhongshan, China',    true, 9),
  ('Batam, Indonesia',    true, 10),
  ('Chennai, India',      true, 11),
  ('Rayong, Thailand',    true, 12),
  ('Riga, Latvia',        true, 13),
  ('Hanoi, Vietnam',      true, 14),
  ('Guadalajara, Mexico', true, 15)
ON CONFLICT (name) DO NOTHING;
