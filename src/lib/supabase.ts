import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eygjoraexgqjnqwnxhfr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uA3VwRJW8OGQoHzPQtuU8Q_3n5JrXQw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
