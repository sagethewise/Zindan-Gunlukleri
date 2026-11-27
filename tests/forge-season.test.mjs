import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {TARGET_D4_SEASON,LEGACY_D4_SEASON,D4_SEASON_16,season16Status,isKnownSeason} from "../src/lib/constants.ts";
import {newPlan,parsePlan} from "../src/lib/forge-planner.ts";
test("S16 is the target, launch stays scheduled until verified",()=>{assert.equal(TARGET_D4_SEASON,16);assert.equal(LEGACY_D4_SEASON,10);assert.equal(D4_SEASON_16.patch,"3.3.0");assert.equal(season16Status(Date.parse("2026-11-27T12:00:00Z")),"upcoming");assert.equal(season16Status(Date.parse(D4_SEASON_16.scheduledStart)),"check-live");assert.ok(isKnownSeason(10));assert.ok(isKnownSeason(16));assert.ok(!isKnownSeason(999))});
test("new drafts target S16, legacy and unspecified drafts retain original season",()=>{assert.equal(newPlan("new").season,"16");assert.equal(parsePlan({...newPlan("old"),season:"10"}).season,"10");assert.equal(parsePlan({...newPlan("unspecified"),season:""}).season,"")});
test("legacy snapshot never enters S16 build listing",()=>{const s=readFileSync(new URL("../src/lib/builds.ts",import.meta.url),"utf8");assert.match(s,/if\(season!==LEGACY_D4_SEASON\)return \[\]/);assert.match(s,/\.eq\("season", LEGACY_D4_SEASON\)/);assert.doesNotMatch(s,/season: row.season \?\?/);});
test("gear archive picker is restricted to explicitly selected legacy season",()=>{const s=readFileSync(new URL("../src/components/builds/ForgePlanner.tsx",import.meta.url),"utf8");assert.ok(s.includes('picker&&plan.season==="10"'));assert.ok(s.includes('disabled={plan.season!=="10"}'));});
