"use client";

export default function Questionnaire() {
  const options = [
    "Klasik build örnekleri",
    "Taktik ve oynanış önerileri",
    "PHB dışı ek seçenekler (Xanathar’s Guide, Tasha’s Cauldron gibi kaynaklardan)",
    "Character Sheet",
  ];

  return (
    <div className="mt-12 p-6 border rounded-md shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold text-brand">🧠 Daha fazla içerik ister misiniz?</h2>
      <p className="text-sm text-gray-700">
        Aşağıdaki konulardan birini seçerek bize rehber hazırlamamıza yardımcı olun:
      </p>

      <form
        action="https://formsubmit.co/asliggiray@outlook.com"
        method="POST"
        className="space-y-3"
      >
        {options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              name="Tercih Edilen Konu"
              value={option}
              className="form-radio text-brand"
              required
            />
            <span>{option}</span>
          </label>
        ))}

        {/* Formsubmit ayarları */}
        <input type="hidden" name="_captcha" value="false" />
        
        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
        >
          Gönder ✉️
        </button>
      </form>
    </div>
  );
}
