import ContactForm from "@/components/ContactForm"; // Yol yapına göre ayarla

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">📬 Nedir durum, yardımcı olalım!</h1>
      <p className="text-gray-600 mb-8 text-center">
        Görüş, öneri ya da sihirli sorularınız varsa buradayız. 🧙‍♀️
      </p>

      <ContactForm />
    </main>
  );
}
