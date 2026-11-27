import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
export const languages=["tr","en","de"];
const validDate=x=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x+"T00:00:00Z").toISOString().slice(0,10)===x;
const text=(v,max)=>typeof v==="string"&&v.trim().length>0&&v.length<=max;
const check=(ok,msg)=>{if(!ok)throw new Error(msg)};
export function validateFacts(input){
 check(input&&typeof input==="object","Missing input");
 const u=new URL(input.sourceUrl);
 check(u.protocol==="https:"&&u.hostname==="news.blizzard.com"&&!u.username&&!u.password&&/^\/[a-z]{2}-[a-z]{2}\/article\/\d+(?:\/[^/]+)?\/?$/.test(u.pathname),"Use an official Blizzard article URL");
 const articleId=u.pathname.match(/\/article\/(\d+)/)[1];
 check(["patch","season","announcement","ptr"].includes(input.kind),"Invalid kind");
 check(validDate(input.announcementDate),"Verified announcement date required");
 check(input.releaseDate===null||validDate(input.releaseDate),"Invalid release date");
 check(text(input.updateKey,70)&&/^[a-z0-9][a-z0-9.-]*$/.test(input.updateKey),"Unique update key required, e.g. patch-3.3.0-build-74415");
 check(Array.isArray(input.facts)&&input.facts.length>=2&&input.facts.length<=16&&input.facts.every(x=>text(x,300)),"Provide 2–16 concise factual notes in your own words (max 300 characters each)");
 check(input.factsReviewed===true,"Facts must be manually verified and independently summarized");
 check(input.rightsAcknowledged===true,"Confirm source material is not copied and rights were reviewed");
 return {sourceUrl:"https://news.blizzard.com"+u.pathname.replace(/\/$/,""),articleId,kind:input.kind,announcementDate:input.announcementDate,releaseDate:input.releaseDate,updateKey:input.updateKey,facts:input.facts.map(x=>x.trim()),factsReviewed:true,rightsAcknowledged:true};
}
export function identity(facts){return facts.articleId+":"+facts.updateKey}
export function fingerprint(facts){return createHash("sha256").update(JSON.stringify(facts)).digest("hex")}
export function makePrompt(input){
 const facts=validateFacts(input);
 return "Create an independent editorial briefing for Dungeon Diaries in Turkish (tr), English (en) and German (de). Use ONLY the concise reviewed factual notes below; do not retrieve or reconstruct the source article, copy its prose, or invent changes, dates, numbers, quotations or recommendations. Distinguish announcement from scheduled release and PTR from live. Summarize and explain player relevance in original language, 100–220 words per language. Mark uncertainty. Return JSON only: {tr:{title,summary,body},en:{title,summary,body},de:{title,summary,body}}. Each body is Markdown with ## headings, no HTML or external links; source link will be appended automatically.\n\n"+JSON.stringify(facts,null,2);
}
export function createDraft(input,translations){
 const facts=validateFacts(input);
 return {version:1,state:"draft",facts,fingerprint:fingerprint(facts),translations:validateTranslations(translations)};
}
export async function generateDraft(input,{key=process.env.OPENAI_API_KEY,model=process.env.OPENAI_MODEL,fetchImpl=fetch}={}){
 check(text(key,500)&&text(model,100),"Set OPENAI_API_KEY and OPENAI_MODEL in the server environment");
 const languageSchema={type:"object",properties:{title:{type:"string"},summary:{type:"string"},body:{type:"string"}},required:["title","summary","body"],additionalProperties:false};
 const response=await fetchImpl("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},signal:AbortSignal.timeout(90000),body:JSON.stringify({model,input:makePrompt(input),store:false,max_output_tokens:4000,text:{format:{type:"json_schema",name:"editorial_draft",strict:true,schema:{type:"object",properties:Object.fromEntries(languages.map(l=>[l,languageSchema])),required:languages,additionalProperties:false}}}})});
 check(response.ok,"AI API request failed ("+response.status+")");
 const result=await response.json();
 check(result.status==="completed","AI response incomplete");
 const output=result.output?.flatMap(x=>x.content??[]).filter(x=>x.type==="output_text").map(x=>x.text).join("");
 check(text(output,30000),"AI response unavailable");
 return createDraft(input,JSON.parse(output));
}
export function validateTranslations(translations){
 const out={};for(const locale of languages){const x=translations?.[locale];check(x&&text(x.title,160)&&text(x.summary,350)&&text(x.body,5000),locale+": title, summary and body required");check(!/<\/?[a-z][^>]*>/i.test(x.body)&&!/(?:https?:\/\/|\]\(\/)/i.test(x.body),"No HTML or links in AI draft body");check(x.body.trim().split(/\s+/).length>=45,locale+": incomplete body");out[locale]={title:x.title.trim(),summary:x.summary.trim(),body:x.body.trim()}}return out;
}
export function validateDraft(draft){
 check(draft?.version===1&&draft.state==="draft","Only unpublished draft format supported");
 const facts=validateFacts(draft.facts);
 check(draft.fingerprint===fingerprint(facts),"Facts changed; regenerate and review draft");
 return {...draft,facts,translations:validateTranslations(draft.translations)};
}
const labels={tr:{source:"Resmi kaynak",notice:"Dungeon Diaries editoryal özeti; yapay zekâ destekli, editör tarafından incelenmiştir.",ann:"Duyuru tarihi",release:"Planlanan / belirtilen yayın tarihi"},en:{source:"Official source",notice:"Dungeon Diaries editorial summary; AI-assisted and editor-reviewed.",ann:"Announcement date",release:"Scheduled / stated release date"},de:{source:"Offizielle Quelle",notice:"Redaktionelle Zusammenfassung von Dungeon Diaries; KI-unterstützt und redaktionell geprüft.",ann:"Ankündigungsdatum",release:"Geplantes / angegebenes Veröffentlichungsdatum"}};
export async function preparePublication(root,draft,{reviewer,publishedDate}){
 const d=validateDraft(draft);
 check(text(reviewer,100),"Explicit reviewer name required");
 check(validDate(publishedDate)&&publishedDate>=d.facts.announcementDate&&publishedDate<=new Date().toISOString().slice(0,10),"Invalid publication date");
 const registryFile=path.join(root,"content/editorial/published-news.json");
 const registry=JSON.parse(await fs.readFile(registryFile,"utf8"));
 const id=identity(d.facts),slug="diablo-iv-"+d.facts.articleId+"-"+d.facts.updateKey.replace(/\./g,"-");
 check(!Object.values(registry).some(row=>row.sourceIdentity===id),"This article/update is already published; use a reviewable correction, not a duplicate");
 check(!registry[slug],"Slug already exists");
 const paths={tr:path.join(root,"content/oyun",slug+".md"),en:path.join(root,"content/translations/en",slug+".md"),de:path.join(root,"content/translations/de",slug+".md")};
 for(const f of Object.values(paths)){try{await fs.access(f);throw new Error("Article already exists: "+f)}catch(e){if(e.code!=="ENOENT")throw e}}
 const contents={};
 for(const locale of languages){const x=d.translations[locale],l=labels[locale];const sourceBlock="\n\n---\n\n"+l.notice+"\n\n"+l.ann+": "+d.facts.announcementDate+(d.facts.releaseDate?"\n\n"+l.release+": "+d.facts.releaseDate:"")+"\n\n["+l.source+" — Blizzard Entertainment]("+d.facts.sourceUrl+")\n";
 const front=locale==="tr"?"---\ntitle: "+JSON.stringify(x.title)+"\ndate: "+JSON.stringify(publishedDate)+"\nsummary: "+JSON.stringify(x.summary)+"\ncategory: \"Diablo IV\"\ntags: [\"Diablo IV\", \"Patch News\"]\ncoverImage: \"\"\n---\n\n":"";
 contents[locale]=front+x.body+sourceBlock;}
 const metadata={sourceIdentity:id,sourceUrl:d.facts.sourceUrl,sourceFingerprint:d.fingerprint,kind:d.facts.kind,announcementDate:d.facts.announcementDate,releaseDate:d.facts.releaseDate,publishedDate,reviewer,reviewedAt:new Date().toISOString(),en:[d.translations.en.title,d.translations.en.summary],de:[d.translations.de.title,d.translations.de.summary]};
 return {slug,paths,contents,registryFile,registry:{...registry,[slug]:metadata}};
}
export async function publishLocal(root,draft,review){
 const plan=await preparePublication(root,draft,review),written=[];
 try{for(const l of languages){await fs.writeFile(plan.paths[l],plan.contents[l],{flag:"wx"});written.push(plan.paths[l])}
 const temp=plan.registryFile+".tmp-"+process.pid;await fs.writeFile(temp,JSON.stringify(plan.registry,null,2)+"\n",{flag:"wx"});await fs.rename(temp,plan.registryFile);
 }catch(e){for(const f of written)await fs.unlink(f).catch(()=>{});throw e}
 return plan.slug;
}
async function main(){
 const [command,inputFile,...args]=process.argv.slice(2);check(inputFile,"Usage: prompt facts.json | generate facts.json | draft facts.json translations.json | validate draft.json | publish draft.json reviewer YYYY-MM-DD");
 const input=JSON.parse(await fs.readFile(inputFile,"utf8"));
 if(command==="generate"){console.log(JSON.stringify(await generateDraft(input),null,2));return}
 if(command==="prompt"){console.log(makePrompt(input));return}
 if(command==="draft"){check(args[0],"Translations JSON required");console.log(JSON.stringify(createDraft(input,JSON.parse(await fs.readFile(args[0],"utf8"))),null,2));return}
 if(command==="validate"){validateDraft(input);console.log("Draft valid; editorial review still required.");return}
 if(command==="publish"){check(args.length===2,"Reviewer and publication date required");console.log("Created local files:",await publishLocal(ROOT,input,{reviewer:args[0],publishedDate:args[1]}));return}
 throw new Error("Unknown command");
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1});
