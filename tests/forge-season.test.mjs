import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {TARGET_D4_SEASON,PREVIOUS_D4_SEASON,D4_SEASON_15,D4_SEASON_16,season16Status,isKnownSeason} from "../src/lib/constants.ts";
import {newPlan,parsePlan} from "../src/lib/forge-planner.ts";
test("S15 and S16 are public; S16 remains scheduled until verified",()=>{assert.equal(TARGET_D4_SEASON,16);assert.equal(PREVIOUS_D4_SEASON,15);assert.equal(D4_SEASON_15.patch,"3.2.4");assert.equal(D4_SEASON_16.patch,"3.3.0");assert.equal(season16Status(Date.parse("2026-11-27T12:00:00Z")),"upcoming");assert.equal(season16Status(Date.parse(D4_SEASON_16.scheduledStart)),"check-live");assert.ok(!isKnownSeason(10));assert.ok(isKnownSeason(15));assert.ok(isKnownSeason(16));});
test("new drafts target S16, old and unspecified drafts retain original season",()=>{assert.equal(newPlan("new").season,"16");assert.equal(parsePlan({...newPlan("old"),season:"10"}).season,"10");assert.equal(parsePlan({...newPlan("unspecified"),season:""}).season,"")});
test("legacy data never enters S15/S16 list or detail",()=>{const s=readFileSync(new URL("../src/lib/builds.ts",import.meta.url),"utf8");assert.doesNotMatch(s,/\.from\(/);assert.match(s,/Promise<D4Build\[\]>\{return \[\]\}/);assert.match(s,/Promise<D4Build\|null>\{return null\}/)});
test("legacy archive endpoint withdrawn and planner has S15/S16 options only",()=>{const s=readFileSync(new URL("../src/components/builds/ForgePlanner.tsx",import.meta.url),"utf8");assert.ok(s.includes('<option value="15">'));assert.ok(!s.includes('<option value="10">'));assert.ok(!s.includes("GearArchiveDialog"));const api=readFileSync(new URL("../src/app/api/forge/archive/route.ts",import.meta.url),"utf8");assert.match(api,/status:410/);});
