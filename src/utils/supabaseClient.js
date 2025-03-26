import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hanlwbbbniiujtzutpbv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhbmx3YmJibmlpdWp0enV0cGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NzM3MjgsImV4cCI6MjA1NTU0OTcyOH0.WG-NlQ4atZdiQVPPqPNefAQJS00ObgV-73tGrWgHEgY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 