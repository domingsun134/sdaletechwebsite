-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    email TEXT,
    hiring_manager_email TEXT,
    status TEXT DEFAULT 'Active',
    highlights TEXT,
    career_level TEXT,
    created_by TEXT
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    job_id UUID REFERENCES jobs(id),
    job_title TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'applied',
    analysis JSONB
);

-- Create interview_slots table
CREATE TABLE IF NOT EXISTS interview_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'open', -- open, booked
    booked_by JSONB, -- { name, email, applicationId }
    application_id UUID REFERENCES applications(id)
);

-- Enable Row Level Security (RLS) - Optional for now, but good practice
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_slots ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for simplistic public usage as requested, refine later for auth)
-- Create policies (Allow all for simplistic public usage as requested, refine later for auth)
DROP POLICY IF EXISTS "Allow public access to jobs" ON jobs;
CREATE POLICY "Allow public access to jobs" ON jobs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public access to applications" ON applications;
CREATE POLICY "Allow public access to applications" ON applications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public access to interview_slots" ON interview_slots;
CREATE POLICY "Allow public access to interview_slots" ON interview_slots FOR ALL USING (true);

-- Create Private Storage Bucket for Resumes
-- Note: 'public' is set to false
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow anonymous users (candidates) to upload resumes
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users (admins) to view resumes
DROP POLICY IF EXISTS "Allow authenticated view" ON storage.objects;
CREATE POLICY "Allow authenticated view"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');
