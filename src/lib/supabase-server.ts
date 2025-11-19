// src/lib/supabase-server.ts
import "server-only";

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// Next 15 ile birlikte cookies() async hale geldi.
// Burada cookies fonksiyonunu doğrudan Supabase'e pass ediyoruz.
// Böylece route'larda `cookies().get(...)` hatası almıyoruz.
export const createClient = () =>
  createServerComponentClient({
    cookies,
  });
