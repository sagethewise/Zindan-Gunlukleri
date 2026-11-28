import test from "node:test";
import assert from "node:assert/strict";
import {referenceEntries,referenceTables,previewEnabled} from "../src/lib/forge-preview-catalog.ts";
import {filterCatalog,defaultFilter,parsePublicCatalog} from "../src/lib/forge-catalog.ts";
test("preview guard fails closed",()=>{for(const value of ["production","development",undefined,""])assert.equal(previewEnabled(value),false);assert.equal(previewEnabled("preview"),true)});
test("reference names searchable in every locale, no unverified stats or translations inferred",()=>{
 const rows=referenceEntries(referenceTables[0],[{id:1,name_en:"Sample Helm",name_tr:"Örnek Miğfer",class_key:"druid",data:{secret:"never"},description_en:"never"}]);
 assert.equal(rows.length,1);assert.equal(rows[0].channel,"historical");assert.equal(rows[0].patch,"Unverified");assert.equal(rows[0].reference,true);
 assert.equal(rows[0].texts.de.name,"Sample Helm");assert.equal(rows[0].texts.en.description,undefined);assert.ok(!JSON.stringify(rows).includes("never"));
 for(const locale of ["tr","en","de"]){assert.equal(filterCatalog(rows,locale,{...defaultFilter,query:"sample"}).length,1);assert.equal(filterCatalog(rows,locale,{...defaultFilter,query:"örnek"}).length,1);assert.equal(filterCatalog(rows,locale,{...defaultFilter,patch:"3.2.4"}).length,0);assert.equal(filterCatalog(rows,locale,{...defaultFilter,classKey:"rogue"}).length,0);}
});
test("reject malformed rows and deduplicate reference IDs",()=>{const rows=referenceEntries(referenceTables[0],[null,{id:1,name_en:"A"},{id:1,name_en:"A"},{id:2},{name_en:"B"}]);assert.equal(rows.length,1)});
test("published parser cannot adopt unreviewed preview records",()=>{assert.throws(()=>parsePublicCatalog({version:1,entries:referenceEntries(referenceTables[0],[{id:1,name_en:"Sample"}])}))});
