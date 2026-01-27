-- ================================================
-- E'MPIRE User Carts Table Setup
-- ================================================
-- This table stores each user's shopping cart items
-- Run this in Supabase SQL Editor

-- Create the user_carts table
CREATE TABLE IF NOT EXISTS user_carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_carts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only read their own cart
CREATE POLICY "Users can view their own cart"
    ON user_carts
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own cart
CREATE POLICY "Users can create their own cart"
    ON user_carts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cart
CREATE POLICY "Users can update their own cart"
    ON user_carts
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own cart
CREATE POLICY "Users can delete their own cart"
    ON user_carts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON user_carts TO authenticated;
GRANT SELECT ON user_carts TO anon;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_user_carts_timestamp ON user_carts;
CREATE TRIGGER update_user_carts_timestamp
    BEFORE UPDATE ON user_carts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_carts_updated_at();

-- ================================================
-- DONE! Your cart system is now ready.
-- ================================================
