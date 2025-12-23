import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sjcefdpfvaacqidqnawn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqY2VmZHBmdmFhY3FpZHFuYXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NTM0NDMsImV4cCI6MjA4MjAyOTQ0M30.H6i1MKbmwna9OJKPlSgQY1s597jUFqNCK_5ag15yuo8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
