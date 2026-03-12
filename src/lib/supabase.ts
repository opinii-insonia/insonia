import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pzowcqnbocsijdkdsxap.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6b3djcW5ib2NzaWpka2RzeGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjY0ODAsImV4cCI6MjA4ODkwMjQ4MH0.AuJus5otkQDXGlyharmydDfjgA8bYXIx6ihIZIb7bzE";

export const supabase = createClient(supabaseUrl, supabaseKey);