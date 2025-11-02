// GÜNCELLEME: Doğru yardımcı fonksiyonlar import edildi.
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Tüm oyunları veritabanından çeken GET fonksiyonu (Bu fonksiyon aynı kalabilir)
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// Veritabanına yeni bir oyun ekleyen POST fonksiyonu
export async function POST(request: Request) {
  // GÜNCELLEME: Supabase client'ı Route Handler için doğru şekilde oluşturuldu.
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Bu kontrol artık doğru çalışacak
    return NextResponse.json({ error: 'Oyun eklemek için giriş yapmalısınız.' }, { status: 401 });
  }

  const { name, imageUrl } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'Oyun adı zorunludur.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('games')
    .insert([
      { 
        name: name, 
        // DÜZELTME: Veritabanındaki sütun adıyla aynı olmalı
        imageUrl: imageUrl, 
        added_by: session.user.id, 
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Ekleme Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}