import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {validateFacts,identity,makePrompt,createDraft,generateDraft,validateDraft,preparePublication,publishLocal} from "../scripts/editorial/news.mjs";
const facts={sourceUrl:"https://news.blizzard.com/en-us/article/12345678/fictional-test",kind:"patch",announcementDate:"2025-01-01",releaseDate:"2025-01-02",updateKey:"fixture-1",facts:["Synthetic test fact one.","Synthetic test fact two."],factsReviewed:true,rightsAcknowledged:true};
const text=Array(55).fill("test").join(" ");
const translations=Object.fromEntries(["tr","en","de"].map(l=>[l,{title:"Fixture "+l,summary:"Synthetic fixture",body:"## Fixture\n"+text}]));
test("source metadata canonicalized and update identity stable across locale URLs",()=>{const a=validateFacts(facts);assert.equal(identity(a),identity(validateFacts({...facts,sourceUrl:"https://news.blizzard.com/de-de/article/12345678/test"})));assert.notEqual(identity(a),identity(validateFacts({...facts,updateKey:"fixture-2"})))});
test("reject unauthorized host, unreviewed notes and invalid dates",()=>{for(const x of [{sourceUrl:"https://news.blizzard.com.example.org/en-us/article/123/a"},{factsReviewed:false},{rightsAcknowledged:false},{announcementDate:"2025-02-30"}])assert.throws(()=>validateFacts({...facts,...x}))});
test("prompt uses reviewed notes and requires original tr/en/de JSON",()=>{const p=makePrompt(facts);assert.match(p,/independent editorial/);assert.match(p,/Turkish/);assert.match(p,/Synthetic test fact one/)});
test("reject missing languages, source links and modified facts",()=>{assert.throws(()=>createDraft(facts,{tr:translations.tr,en:translations.en}));assert.throws(()=>createDraft(facts,{...translations,tr:{...translations.tr,body:text+" https://example.com"}}));const d=createDraft(facts,translations);assert.throws(()=>validateDraft({...d,facts:{...d.facts,updateKey:"changed"}}))});
test("publishing local files requires review and prevents duplicates",async()=>{const dir=await fs.mkdtemp(path.join(os.tmpdir(),"dd-news-"));try{for(const p of ["content/oyun","content/translations/en","content/translations/de","content/editorial"])await fs.mkdir(path.join(dir,p),{recursive:true});await fs.writeFile(path.join(dir,"content/editorial/published-news.json"),"{}");const d=createDraft(facts,translations);await assert.rejects(preparePublication(dir,d,{reviewer:"",publishedDate:"2025-01-03"}));const slug=await publishLocal(dir,d,{reviewer:"Fixture editor",publishedDate:"2025-01-03"});for(const p of ["oyun","translations/en","translations/de"]){const body=await fs.readFile(path.join(dir,"content",p,slug+".md"),"utf8");assert.ok(body.includes(facts.sourceUrl));assert.ok(body.includes("2025-01-02"))}await assert.rejects(publishLocal(dir,d,{reviewer:"Fixture editor",publishedDate:"2025-01-03"}));}finally{await fs.rm(dir,{recursive:true,force:true})}});
test("optional AI generation sends reviewed notes only and validates response",async()=>{
 const draft=await generateDraft(facts,{key:"test-secret",model:"test-model",fetchImpl:async(url,options)=>{
 assert.equal(url,"https://api.openai.com/v1/responses");const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.text.format.strict,true);assert.match(body.input,/Synthetic test fact one/);
 return {ok:true,json:async()=>({status:"completed",output:[{content:[{type:"output_text",text:JSON.stringify(translations)}]}]})};
 }});assert.deepEqual(draft.translations,translations);
 await assert.rejects(generateDraft(facts,{key:"",model:"test-model"}),/Set OPENAI/);
});
