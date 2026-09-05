import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wolxccbehsbafyirgvgp.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_1NCRxQCEEOEnr0jJ6H-ASg_JQxgdr3L';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
