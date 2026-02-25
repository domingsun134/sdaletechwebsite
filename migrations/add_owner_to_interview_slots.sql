-- Add created_by and company_name to interview_slots
ALTER TABLE interview_slots 
ADD COLUMN IF NOT EXISTS created_by TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Update RLS policies (if any)
-- For now, we rely on the implementation to filter, but essentially:
-- created_by permissions usually allow the creator to manage it.

-- Optional: Backfill existing slots if possible, or they will remain 'global' (orphan) or invisible depending on logic.
-- For safety, we can default company_name to 'Sunningdale Tech Ltd (HQ)' for existing slots if we assume single tenant previously.
-- UPDATE interview_slots SET company_name = 'Sunningdale Tech Ltd (HQ)' WHERE company_name IS NULL;
