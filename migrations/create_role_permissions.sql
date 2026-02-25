-- Create role_permissions table (if not exists)
CREATE TABLE IF NOT EXISTS role_permissions (
    role TEXT PRIMARY KEY,
    permissions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- DROP existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Allow update access to all authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Allow insert access to all authenticated users" ON role_permissions;
DROP POLICY IF EXISTS "Allow read access to anon" ON role_permissions;
DROP POLICY IF EXISTS "Allow all access to anon" ON role_permissions;

-- Create policies allowing access to 'anon' (since app uses custom auth, not Supabase Auth)
-- CAUTION: This means anyone with the Anon Key can read/write this table. 
-- Security is delegated to the Application Layer (Admin Portal protection).

CREATE POLICY "Allow all access to public"
    ON role_permissions
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Insert default permissions
INSERT INTO role_permissions (role, permissions) VALUES
('super_admin', '["/admin/dashboard", "/admin/content", "/admin/analytics", "/admin/jobs", "/admin/users", "/admin/events"]'::jsonb),
('site_admin', '["/admin/dashboard", "/admin/content", "/admin/analytics", "/admin/jobs", "/admin/users", "/admin/events"]'::jsonb),
('hr_user', '["/admin/dashboard", "/admin/content", "/admin/jobs", "/admin/events"]'::jsonb),
('admin', '["/admin/dashboard", "/admin/content", "/admin/analytics", "/admin/jobs", "/admin/users", "/admin/events"]'::jsonb),
('marketing', '["/admin/dashboard", "/admin/content", "/admin/analytics", "/admin/events"]'::jsonb),
('hr', '["/admin/dashboard", "/admin/content", "/admin/jobs", "/admin/events"]'::jsonb)
ON CONFLICT (role) DO NOTHING;
