import Link from "next/link";

export default function TesekkurlerPage() {
    return (
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Teşekkürler! 🎉</h1>
        <p className="text-gray-600">
          Aboneliğiniz başarıyla alındı. Size en yeni içerikleri ulaştıracağız.
        </p>
  
        <Link
          href="/"
          className="inline-block mt-6 text-sm text-green-600 hover:underline"
        >
          Ana sayfaya dön →
        </Link>
      </main>
    );
  }
  