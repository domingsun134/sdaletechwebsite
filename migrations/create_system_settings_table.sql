-- System settings table: generic key-value store for configurable app settings
CREATE TABLE IF NOT EXISTS system_settings (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL DEFAULT '',
    description TEXT,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default RPA notification email list
INSERT INTO system_settings (key, value, description) VALUES (
    'rpa_notification_emails',
    'meichern.oh@sdaletech.com;linkang.sun@sdaletech.com;elaine.tua@sdaletech.com;vivien.lye@sdaletech.com;jessica.wong@sdaletech.com;helen.ng@sdaletech.com;pohwi.tan@sdaletech.com',
    'Semicolon-separated list of email recipients for RPA AD provisioning notifications'
)
ON CONFLICT (key) DO NOTHING;

-- Grant access (adjust to your Supabase RLS policy as needed)
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only service_role (backend) can read/write
CREATE POLICY "service_role_all" ON system_settings
    FOR ALL USING (auth.role() = 'service_role');
