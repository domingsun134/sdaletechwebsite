-- Create page_views table for internal analytics
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    user_agent TEXT,
    device_type TEXT, -- 'Desktop', 'Mobile', 'Tablet'
    session_id TEXT, -- basic anonymous session tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can view a page)
CREATE POLICY "Allow public inserts to page_views" 
    ON page_views FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated reads (only admins/staff who have analytics access)
CREATE POLICY "Allow authenticated reads on page_views" 
    ON page_views FOR SELECT 
    TO authenticated 
    USING (true);

-- Create index for faster querying by date
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
