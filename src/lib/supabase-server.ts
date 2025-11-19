// src/lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// Database tipin yoksa bu satırı yorumlayabilirsin
// import type { Database } from "./supabase.types";

// Eğer Database tipin yoksa generic'i kaldır:
// export function createClient() {
export function createClient() {
  const cookieStore = cookies();

  // Database tipi tanımlıysa:
  // return createServerComponentClient<Database>({ cookies: () => cookieStore });

  // Şimdilik generic'siz versiyon:
  // @ts-ignore - tipini sonra sıkılaştırırız
  return createServerComponentClient({ cookies: () => cookieStore });
}

// İstersen type alias:
export type SupabaseServerClient = ReturnType<typeof createClient>;
