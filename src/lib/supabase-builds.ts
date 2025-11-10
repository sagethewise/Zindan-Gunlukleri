// src/lib/supabase-builds.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseBuilds = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,       // 👈 doğru projeyi işaret etmeli
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!   // 👈 doğru anon key
);
