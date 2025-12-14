-- Add gender column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'unisex'));

-- Optional: Update existing records to default (e.g. 'unisex') if needed, 
-- but since we will re-seed, we can leave them null or delete them.
