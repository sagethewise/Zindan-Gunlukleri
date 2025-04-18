"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    house: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, house: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form gönderildi!");
  };

  return (
    <section>
        <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-6 space-y-5"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4 text-center">📬 İletişim</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Nedir durum, yardımcı olalım!
          </p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            İsim <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-posta <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hangisi?</label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"].map((house) => (
              <label key={house} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="house"
                  value={house}
                  checked={formData.house === house}
                  onChange={handleRadioChange}
                  className="accent-red-600"
                />
                <span>{house}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Buyrun; nedir konu? <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            name="message"
            id="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 text-sm rounded-md font-medium transition"
          >
            Gönder ✉️
          </button>
        </div>
      </form>
      </div>
    </section>
  );
}
