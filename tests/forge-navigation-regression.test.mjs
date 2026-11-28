import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("Build Forge retains planner and database entry points",()=>{
 const landing=read("src/components/builds/BuildFirini.tsx");
 assert.match(landing,/localizedPath\(locale,"forge","planner"\)/);
 assert.match(landing,/localizedPath\(locale,"forge","database"\)/);
 assert.match(read("src/app/build-firini/planner/page.tsx"),/<ForgePlanner locale="tr"/);
 assert.match(read("src/app/build-firini/database/page.tsx"),/ForgeDatabasePage/);
 const localized=read("src/app/[lang]/[[...parts]]/page.tsx");
 assert.match(localized,/<ForgePlanner locale=\{locale\}/);
 assert.match(localized,/<ForgeDatabasePage locale=\{locale\}/);
});
test("Season 15 and 16 navigation stays wired to the current target",()=>{
 const landing=read("src/components/builds/BuildFirini.tsx");
 assert.match(landing,/seasonPath\(PREVIOUS_D4_SEASON\)/);
 assert.match(landing,/season===TARGET_D4_SEASON/);
 assert.match(read("src/app/build-firini/page.tsx"),/getHomepageBuilds\(TARGET_D4_SEASON\)/);
 assert.match(read("src/app/[lang]/[[...parts]]/page.tsx"),/Number\(suffix\[1\]\):TARGET_D4_SEASON/);
 assert.match(read("src/lib/constants.ts"),/TARGET_D4_SEASON\s*=\s*16/);
 assert.match(read("src/lib/constants.ts"),/PREVIOUS_D4_SEASON\s*=\s*15/);
});
