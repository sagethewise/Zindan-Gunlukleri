// src/app/tier-lists/[id]/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase-server";
import TierListLoader from "@/components/TierListLoader";
import { notFound } from "next/navigation";

// Next 15+: API/SDK uyumu için Node runtime'ı sabitlemek çoğu Supabase projede daha stabil
export const runtime = "nodejs";
export const revalidate = 0; // paylaşılan liste anında güncellensin; dilersen cache’leyebilirsin

type Params = { id: string };

// ---- Dynamic <title> ----
export async function generateMetadata({
  params,
}: {
  // ✅ Next 15: params artık Promise
  params: Promise<Params>;
}) {
  const { id } = await params;

  const supabase = createSupabaseServerClient();
  const { data: list, error } = await supabase
    .from("tier_lists")
    .select("list_name")
    .eq("id", id)
    .single();

  // Hata ya da veri yoksa “Liste Bulunamadı” başlığı
  if (error || !list) {
    return { title: "Liste Bulunamadı | Zindan Günlükleri" };
  }

  return { title: `${list.list_name} | Zindan Günlükleri` };
}

// ---- Page ----
export default async function SharedListPage({
  params,
}: {
  // ✅ Next 15: params Promise
  params: Promise<Params>;
}) {
  const { id } = await params;

  const supabase = createSupabaseServerClient();
  const { data: list, error } = await supabase
    .from("tier_lists")
    .select("id, list_name, list_data")
    .eq("id", id)
    .single();

  if (error || !list) {
    // 404 route
    notFound();
  }

  // Supabase JSONB zaten JS objesi döner; yine de “güvenli parse” bırakıyorum.
  const listData =
    typeof list.list_data === "string"
      ? safeParse(list.list_data)
      : list.list_data;

  return (
    <main className="px-4 py-8 max-w-7xl mx-auto">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">{list.list_name}</h1>
        <p className="mt-2 text-lg text-gray-600">
          Bir kullanıcı tarafından oluşturulmuş tier listesi.
        </p>
      </section>

      {/* 
        TierListLoader’ın beklediği prop isimleri farklıysa aşağıyı ona göre değiştir:
        Örn: <TierListLoader data={listData} readOnly />
      */}
      <TierListLoader listData={listData} isReadOnly />
    </main>
  );
}

// ---- Helpers ----
function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
