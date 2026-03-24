// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Note the '!' at the end. This tells TypeScript that these environment 
// variables will definitely be defined and won't be null/undefined.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize the client
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

/* 🔥 PRO-TIP: The true power of Supabase + TypeScript is passing a generated 
Database type into this client. If you do, your code editor will automatically 
know every table and column in your database!
Example: export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
*/