import {readFile,readdir} from "node:fs/promises";
import path from "node:path";
import {normalizeArchive} from "@/lib/forge-gear";
export const runtime="nodejs";
export const dynamic="force-dynamic";
// Only existing repository archive, never fetch third-party websites. Not the approved public catalog.
export async function GET(){
 if(process.env.VERCEL_ENV==="production")return Response.json({items:[],stats:[],available:false},{status:403});
 try{
  const data=JSON.parse(await readFile(path.join(process.cwd(),"public/data/d4-build-planner-raw-page-data.json"),"utf8"));
  const icons:Record<string,string>={};
  for(const folder of ["barbarian","rogue"]){for(const f of await readdir(path.join(process.cwd(),"public/images/items",folder)).catch(()=>[])){if(!/^[a-z0-9_-]+\.(png|webp)$/i.test(f))continue;const k=f.replace(/\.[^.]+$/,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");if(!icons[k])icons[k]="/images/items/"+folder+"/"+f;}}
  return Response.json({...normalizeArchive(data,icons),available:true},{headers:{"Cache-Control":"private, max-age=300"}});
 }catch{return Response.json({items:[],stats:[],available:false},{status:503});}
}
