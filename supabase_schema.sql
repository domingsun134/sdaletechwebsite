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
    analysis JSONB,
    archived_at TIMESTAMP WITH TIME ZONE
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

-- Create onboarding_submissions table
CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    application_id UUID REFERENCES applications(id),
    personal_details JSONB,
    family_details JSONB,
    contact_details JSONB,
    emergency_contacts JSONB,
    status TEXT DEFAULT 'submitted',
    verified_by TEXT,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Create hr_onboarding_details table
CREATE TABLE IF NOT EXISTS hr_onboarding_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    application_id UUID REFERENCES applications(id),
    employee_code TEXT,
    region TEXT,
    location TEXT,
    company TEXT,
    department TEXT,
    job_title TEXT,
    manager TEXT,
    manager_email TEXT,
    initial_join_date DATE,
    probation_period INTEGER,
    ad_provisioned BOOLEAN DEFAULT FALSE,
    ad_provisioned_at TIMESTAMP WITH TIME ZONE
);

-- Maintenance Tables

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    item TEXT,
    item_full_name TEXT,
    ad_full_name TEXT
);

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    item TEXT,
    item_full_name TEXT,
    ad_full_name TEXT
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    item TEXT,
    item_full_name TEXT,
    ad_full_name TEXT
);

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    item TEXT,
    item_full_name TEXT,
    ad_full_name TEXT
);

-- Create job_titles table
CREATE TABLE IF NOT EXISTS job_titles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    item TEXT,
    item_full_name TEXT,
    ad_full_name TEXT
);

-- Enable Row Level Security (RLS) - Optional for now, but good practice
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_onboarding_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_titles ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow all for simplistic public usage as requested, refine later for auth)
CREATE POLICY "Allow public access to jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Allow public access to applications" ON applications FOR ALL USING (true);
CREATE POLICY "Allow public access to interview_slots" ON interview_slots FOR ALL USING (true);
CREATE POLICY "Allow public access to hr_onboarding_details" ON hr_onboarding_details FOR ALL USING (true);
CREATE POLICY "Allow public access to locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow public access to departments" ON departments FOR ALL USING (true);
CREATE POLICY "Allow public access to companies" ON companies FOR ALL USING (true);
CREATE POLICY "Allow public access to regions" ON regions FOR ALL USING (true);
CREATE POLICY "Allow public access to job_titles" ON job_titles FOR ALL USING (true);

-- Ensure columns exist for onboarding_submissions (if table already existed)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_submissions' AND column_name = 'verified_by') THEN
        ALTER TABLE onboarding_submissions ADD COLUMN verified_by TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'onboarding_submissions' AND column_name = 'verified_at') THEN
        ALTER TABLE onboarding_submissions ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;
