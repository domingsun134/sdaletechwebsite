-- Add resume_filename column to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS resume_filename TEXT;

-- Comment on column
COMMENT ON COLUMN applications.resume_filename IS 'Stores the original filename of the uploaded resume';
