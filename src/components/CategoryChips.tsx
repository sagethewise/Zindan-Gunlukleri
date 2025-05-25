<section className="px-4">
  <h2 className="text-lg font-bold mb-2">🎯 Podcast Kategorileri</h2>
  <div className="flex gap-2 overflow-x-auto">
    {["D&D", "Cyberpunk", "WoD", "FRP Gündem"].map((cat) => (
      <button key={cat} className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm">
        {cat}
      </button>
    ))}
  </div>
</section>
