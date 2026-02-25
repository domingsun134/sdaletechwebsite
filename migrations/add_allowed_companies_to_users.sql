-- Add allowed_companies column to users table for multi-company access
-- This will store an array of company names that the user is allowed to manage
ALTER TABLE users ADD COLUMN IF NOT EXISTS allowed_companies JSONB DEFAULT '[]'::jsonb;
