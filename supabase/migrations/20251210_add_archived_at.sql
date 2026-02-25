-- Add archived_at column to applications table for tracking archival time
ALTER TABLE applications ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
