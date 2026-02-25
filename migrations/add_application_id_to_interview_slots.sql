-- Migration: Add application_id to interview_slots table
-- This allows interview slots to be assigned to specific candidates

-- Add application_id column (nullable for backward compatibility)
ALTER TABLE interview_slots 
ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES applications(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_interview_slots_application_id 
ON interview_slots(application_id);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'interview_slots'
ORDER BY ordinal_position;

-- Show sample data
SELECT id, start_time, end_time, status, application_id
FROM interview_slots
ORDER BY created_at DESC
LIMIT 5;
