import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Listeyi kaydetmek için giriş yapmalısınız.' }, { status: 401 });
  }

  const { listName, listData } = await request.json();

  if (!listName || !listData) {
    return NextResponse.json({ error: 'Liste adı veya verisi eksik.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tier_lists')
    .insert([
      { 
        user_id: session.user.id, 
        list_name: listName, 
        list_data: listData,
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}