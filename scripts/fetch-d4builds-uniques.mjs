// scripts/fetch-d4builds-uniques.mjs
import fs from "node:fs/promises";

const PAGE_DATA_URL =
  "https://d4builds.gg/page-data/database/uniques/page-data.json";

// basit slug helper
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// JSON içinde dolaşıp, elemanları object olan VE en az birinde "name" field'ı bulunan array'leri bul
function findCandidateArrays(node, path = []) {
  const candidates = [];

  if (Array.isArray(node)) {
    if (
      node.length > 0 &&
      typeof node[0] === "object" &&
      node[0] !== null &&
      "name" in node[0]
    ) {
      candidates.push({ path, array: node });
    }
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      candidates.push(...findCandidateArrays(value, [...path, key]));
    }
  }

  return candidates;
}

async function main() {
  console.log("📥 Fetching page-data:", PAGE_DATA_URL);

  const res = await fetch(PAGE_DATA_URL);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} while fetching page-data`);
  }

  const pageData = await res.json();

  // JSON'un tamamını gezip "name" field'ı olan array'leri bul
  const candidates = findCandidateArrays(pageData);

  if (candidates.length === 0) {
    console.error("❌ İçinde 'name' alanı olan hiçbir array bulunamadı.");
    return;
  }

  console.log("🔍 Bulunan candidate array path'leri:");
  candidates.forEach((c, idx) => {
    console.log(
      `  [${idx}]`,
      c.path.join(".") || "<root>",
      `— length: ${c.array.length}`
    );
  });

  // Şimdilik ilk candidate'i seçiyoruz (büyük ihtimalle uniques listesi olacak)
  const chosen = candidates[0];
  console.log(
    "\n✅ Seçilen path:",
    chosen.path.join(".") || "<root>",
    "— length:",
    chosen.array.length
  );
  console.log(
    "🧪 Örnek item:\n",
    JSON.stringify(chosen.array[0], null, 2)
  );

  const rawItems = chosen.array;

const items = rawItems.map((it) => {
  const name = it.name ?? it.title ?? "Unknown Item";

  // slot: Boots / Helm / Ring vs. → JSON'da "type"
  const slot = it.type ?? it.slot ?? null;

  // class: Barbarian / Druid / Any
  const clazz = it.class ?? it.className ?? null;

  // Ek alanlar
  const secondaryStats = it.secondary_stats ?? [];
  const tertiaryStats = it.terciary_stats ?? [];
  const tertiaryStatsFull = it.terciary_stats__full ?? [];
  const effect = it.effect ?? null;
  const flavor = it.flavor ?? null;

  // Şu an JSON'da icon yok, ama ileride eklenirse diye bırakıyoruz
  const iconPath =
    it.icon?.publicURL ??
    it.iconUrl ??
    it.icon_path ??
    "";

  const iconFullUrl = iconPath
    ? iconPath.startsWith("http")
      ? iconPath
      : `https://d4builds.gg${iconPath}`
    : "";

  return {
    id: it.id ?? toSlug(name),
    name,
    slot,              // Boots / Helm...
    class: clazz,      // Barbarian...
    secondaryStats,    // string[]
    tertiaryStats,     // string[]
    tertiaryStatsFull, // string[]
    effect,            // string | null
    flavor,            // string | null
    icon: iconFullUrl, // şimdilik çoğu boş kalacak
    source: "d4builds-uniques",
  };
});


  console.log("\n📊 Toplam map'lenen item sayısı:", items.length);

  // Ham page-data'yı da istersen incelemek için kaydedelim:
  const rawOutPath = new URL(
    "../public/data/d4-uniques-raw-page-data.json",
    import.meta.url
  );
  await fs.mkdir(new URL("../public/data/", import.meta.url), {
    recursive: true,
  });
  await fs.writeFile(
    rawOutPath,
    JSON.stringify(pageData, null, 2),
    "utf8"
  );
  console.log("💾 Ham page-data kaydedildi:", rawOutPath.pathname);

  // Sadece işimize yarayan, normalize edilmiş liste:
  const outPath = new URL(
    "../public/data/d4builds-unique-items.json",
    import.meta.url
  );
  await fs.writeFile(outPath, JSON.stringify(items, null, 2), "utf8");
  console.log("💾 Normalize edilmiş item listesi kaydedildi:", outPath.pathname);
}

main().catch((err) => {
  console.error("❌ Fetch script error:", err);
  process.exit(1);
});
