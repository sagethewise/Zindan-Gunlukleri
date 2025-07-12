import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Bu fonksiyon, Sunucu Komponentleri (Server Components), 
// API Rotaları (Route Handlers) ve Sunucu Aksiyonları (Server Actions) 
// içinde kullanılmak üzere tasarlanmıştır.
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({
    cookies: () => cookieStore,
  })
}