-- Enable Row Level Security
ALTER TABLE warning_types ENABLE ROW LEVEL SECURITY;

-- Create policy to allow any authenticated user to insert warning types
CREATE POLICY "Enable insert for authenticated users only"
ON warning_types
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Allow all users to view warning types
CREATE POLICY "Enable read access for all users"
ON warning_types
FOR SELECT
TO public
USING (true);
