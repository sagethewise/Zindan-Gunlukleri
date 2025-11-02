import { createSupabaseServerClient } from "@/lib/supabase-server";
import TierListLoader from "@/components/TierListLoader";
import { notFound } from "next/navigation";


// Sayfanın başlığını dinamik olarak ayarlamak için
export async function generateMetadata({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();
    const { data: list } = await supabase
        .from('tier_lists')
        .select('list_name')
        .eq('id', params.id)
        .single();

    return {
        title: list ? `${list.list_name} | Zindan Günlükleri` : 'Liste Bulunamadı',
    };
}

export default async function SharedListPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();

    // URL'deki ID'yi kullanarak veritabanından ilgili listeyi çek
    const { data: list } = await supabase
        .from('tier_lists')
        .select('id, list_name, list_data')
        .eq('id', params.id)
        .single();

    // Eğer liste bulunamazsa, 404 sayfasına yönlendir
    if (!list) {
        notFound();
    }

    return (
        <main className="px-4 py-8 max-w-7xl mx-auto">
            <section className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    {list.list_name}
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Bir kullanıcı tarafından oluşturulmuş tier listesi.
                </p>
            </section>
            
            {/* TierListLoader'a veriyi ve 'isReadOnly' prop'unu gönderiyoruz.
              `list.list_data` bizim JSONB sütunumuzdan gelen asıl liste verisidir.
            */}
            <TierListLoader 
                listToShow={list.list_data} 
                isReadOnly={true} 
            />
        </main>
    );
}