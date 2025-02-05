import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

export const supabaseClient = createClient<Database>(
  'https://xjtnojqcyhztaamvjagn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdG5vanFjeWh6dGFhbXZqYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MDI1ODIsImV4cCI6MjA1NDA3ODU4Mn0.uR72bNZrdWvWx_L5TkVlSvzn2chUznXguDxF1fXv-Hg'
);

// handle auto redirect to login page
supabaseClient.auth.onAuthStateChange((_, session) => {
    if (session?.user) {
      if (window.location.pathname === '/login') {
        window.location.pathname = '/';
      }
    } else {
      if (window.location.pathname !== '/login') {
        window.location.pathname = '/login';
      }
    }
});