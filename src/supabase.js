import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tdaaqnwttuziamiacati.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkYWFxbnd0dHV6aWFtaWFjYXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MzE5OTUsImV4cCI6MjEwNTEwNzk5NX0.Fuss6PHDzIXAUxTaw0exesjNa6mn_pLokmsBJXZ2iuc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
