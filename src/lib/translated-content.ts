import fs from "node:fs";
import path from "node:path";
import type {Locale} from "./i18n";
export function getTranslatedContent(locale:Locale,slug:string):string|null{
 if(locale==="tr"||! /^[a-zA-Z0-9-]+$/.test(slug))return null;
 const file=path.join(process.cwd(),"content","translations",locale,slug+".md");
 return fs.existsSync(file)?fs.readFileSync(file,"utf8"):null;
}
