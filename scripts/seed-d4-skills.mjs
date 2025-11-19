// scripts/seed-d4-skills.mjs
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// 📌 .env.local dosyasını oku
dotenv.config({ path: ".env.local" });
// Eğer üretimdeysen ".env.production" da ekleyebiliriz
console.log("Loaded ENV:", {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) + "...",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // seed için şart

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("URL:", supabaseUrl);
  console.error("KEY:", supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const INPUT_PATH = path.join(
  process.cwd(),
  "public",
  "data",
  "d4builds-class-skills.json"
);

async function main() {
  const content = fs.readFileSync(INPUT_PATH, "utf8");
  const skills = JSON.parse(content);

  console.log("Seeding d4_skills… total:", skills.length);

  const { error } = await supabase.from("d4_skills").upsert(skills, {
    onConflict: "key",
  });

  if (error) {
    console.error("❌ Error upserting d4_skills:", error);
  } else {
    console.log("✅ d4_skills seeded successfully.");
  }
}

main().catch((err) => {
  console.error("❌ Script error:", err);
  process.exit(1);
});
