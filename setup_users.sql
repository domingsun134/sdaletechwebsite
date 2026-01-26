-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    username TEXT NOT NULL,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'hr',
    email TEXT,
    azure_oid TEXT UNIQUE,
    company_name TEXT
);

-- Enable RLS (Optional, for future proofing)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public access (Simplification for MVP)
CREATE POLICY "Allow public access to users" ON users FOR ALL USING (true);

-- Seed Default Admin User (Password: admin123)
INSERT INTO users (username, password, name, role, email)
VALUES ('admin', '$2a$10$x9mSu9vz73urhKLQg0kaDurgFtO8RMkTLk0MUaCfxxt2FFYva4fgVS', 'System Administrator', 'admin', 'admin@sdaletech.com');
