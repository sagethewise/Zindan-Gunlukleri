'use client';

import { useState } from 'react';

const Questionnaire = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setSubmitted(true);
    } else {
      alert("Lütfen bir konu seçin.");
    }
  };

  const options = [
    'En iyi build rehberleri',
    'Endgame aktivite rotaları',
    'PvP stratejileri',
    'Meta analizleri',
  ];

  return (
    <div className="mt-12 p-6 border rounded-md shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold text-brand">🧠 Daha fazla içerik ister misiniz?</h2>
      <p className="text-sm text-gray-700">Aşağıdaki konulardan birini seçerek bize rehber hazırlamamıza yardımcı olun:</p>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                name="questionnaire"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="form-radio text-brand"
              />
              <span>{option}</span>
            </label>
          ))}

          <button
            type="submit"
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
          >
            Gönder ✉️
          </button>
        </form>
      ) : (
        <p className="text-green-700 font-medium mt-4">
          Teşekkürler! Tercihlerin alındı. Yeni içerikler yolda. 🚀
        </p>
      )}
    </div>
  );
};

export default Questionnaire;
