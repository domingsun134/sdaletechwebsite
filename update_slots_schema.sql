-- Add columns for meeting type and room details to interview_slots
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interview_slots' AND column_name = 'meeting_type') THEN
        ALTER TABLE interview_slots ADD COLUMN meeting_type TEXT DEFAULT 'online'; -- 'online' or 'onsite'
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interview_slots' AND column_name = 'room_details') THEN
        ALTER TABLE interview_slots ADD COLUMN room_details JSONB; -- { name, email, id }
    END IF;
END $$;
