import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import matter from "gray-matter";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const slug="diablo-iv-3-3-0-sezon-16";
test("source band rendered once outside page content before footer",()=>{
 const layout=read("src/app/layout.tsx");assert.match(layout,/<main>\{children\}<\/main>\s*\{showSources&&<ForgeSourceLinks locale=\{locale\}\/\>\}\s*<Footer \/>/);
 for(const p of ["BuildFirini","ForgeDatabase"])assert.doesNotMatch(read("src/components/builds/"+p+".tsx"),/<ForgeSourceLinks/);
 assert.match(read("src/app/globals.css"),/\.forge-sources-band\+\.dd-footer\{margin-top:0\}/);
});
test("preview is a single linked tr/en/de article with explicit pending status",()=>{
 const tr=matter(read("content/oyun/"+slug+".md"));assert.equal(tr.data.previewOnly,true);assert.equal(tr.data.date,"2026-11-27");
 const registry=JSON.parse(read("content/editorial/preview-news.json"));assert.equal(registry[slug].reviewState,"pending");assert.equal(registry[slug].releaseDate,"2026-12-01");
 assert.equal(JSON.parse(read("content/editorial/published-news.json"))[slug],undefined);
 for(const [locale,body] of [["tr",tr.content],["en",read("content/translations/en/"+slug+".md")],["de",read("content/translations/de/"+slug+".md")]]){assert.match(body,/3\.3\.0/);assert.match(body,/74415/);assert.match(body,/https:\/\/news\.blizzard\.com\/en-us\/article\/24316980/);if(locale!=="tr")assert.equal(registry[slug][locale].length,2);}
});
test("preview-only article not in production readers or sitemap",()=>{const s=read("src/lib/posts.ts");assert.equal((s.match(/data\.previewOnly===true && process\.env\.VERCEL_ENV==="production"/g)||[]).length,3);assert.match(read("src/app/sitemap.ts"),/if\(p\.metadata\.previewOnly\)continue/);assert.match(read("src/app/oyun/[slug]/page.tsx"),/previewOnly\?\{robots:\{index:false/);});
