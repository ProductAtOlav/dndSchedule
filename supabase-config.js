// Supabase konfigurasjon
// Erstatt disse med dine egne verdier fra Supabase Dashboard

const SUPABASE_URL = 'https://ohovonrrwrygteolfomy.supabase.co'; // eks: https://ohovonrrwrygteolfomy.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ob3ZvbnJyd3J5Z3Rlb2xmb215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODQxODQsImV4cCI6MjA4NjU2MDE4NH0.2dDnzOl9nPKUoBZrwvxUlRlT8vmQmhXWTlkXRb2ZHMc'; // Public anon key fra Settings > API

// Initialiser Supabase-klient
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* */