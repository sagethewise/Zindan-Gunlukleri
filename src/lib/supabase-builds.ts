import { createClient } from "@supabase/supabase-js";

export const supabaseBuilds = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { db: { schema: "buildfirini" }, auth: { persistSession: false } }
);
