-- ================================================
-- E'MPIRE Admin Sales Performance Table Setup
-- ================================================
-- This table stores editable base sales parameters for the Admin Dashboard
-- Run this script in the Supabase SQL Editor

-- Create sales_performance table
CREATE TABLE IF NOT EXISTS sales_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sales_period_months INT NOT NULL DEFAULT 3 CHECK (sales_period_months > 0),
    total_bottles_sold INT NOT NULL DEFAULT 600 CHECK (total_bottles_sold >= 0),
    price_per_bottle NUMERIC(10, 2) NOT NULL DEFAULT 1170.00 CHECK (price_per_bottle >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick sorting/lookup
CREATE INDEX IF NOT EXISTS idx_sales_performance_updated_at ON sales_performance(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE sales_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Allow public select so admin dashboard can read sales summary data
CREATE POLICY "Allow public read access to sales performance"
    ON sales_performance
    FOR SELECT
    USING (true);

-- Allow public insert/update
CREATE POLICY "Allow write access to sales performance"
    ON sales_performance
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Seed initial row if table is empty
INSERT INTO sales_performance (sales_period_months, total_bottles_sold, price_per_bottle)
SELECT 3, 600, 1170.00
WHERE NOT EXISTS (SELECT 1 FROM sales_performance);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sales_performance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_update_sales_performance_timestamp ON sales_performance;
CREATE TRIGGER trigger_update_sales_performance_timestamp
    BEFORE UPDATE ON sales_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_sales_performance_updated_at();

-- Grant permissions
GRANT ALL ON sales_performance TO anon;
GRANT ALL ON sales_performance TO authenticated;

-- ================================================
-- DONE! sales_performance table setup ready.
-- ================================================
