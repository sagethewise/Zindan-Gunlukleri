import assert from "node:assert/strict";
import test from "node:test";
import {newPlan,parsePlan,slots,plannerClasses} from "../src/lib/forge-planner.ts";
test("new plans have all slots and six skills",()=>{const p=newPlan("one");assert.equal(p.skills.length,6);assert.equal(Object.keys(p.gear).length,slots.length);assert.equal(plannerClasses.length,8)});
test("valid round trip",()=>{const p=newPlan("one");p.title="Test";p.classId="paladin";p.gear.helm.item="Custom helm";p.boards.push({name:"Board",glyph:"Glyph",notes:"Note"});assert.deepEqual(parsePlan(JSON.parse(JSON.stringify(p))),p)});
test("reject invalid data",()=>{assert.equal(parsePlan(null),null);assert.equal(parsePlan({version:7}),null);assert.equal(parsePlan({...newPlan("one"),classId:"unknown"}),null)});
test("normalizes fields and clamps oversized imports",()=>{const p=parsePlan({...newPlan("one"),title:"a".repeat(200),gear:{helm:{item:42}},skills:[{name:"A"},{name:"B"}],boards:Array.from({length:30},()=>({name:"A"}))});assert.equal(p.title.length,120);assert.equal(p.gear.helm.item,"");assert.equal(p.skills.length,6);assert.equal(p.boards.length,20)});
