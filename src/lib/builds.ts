"use server";
import {TARGET_D4_SEASON,isKnownSeason} from "@/lib/constants";
import manifest from "../../content/forge/public-builds.json";
import type {D4Build} from "@/lib/types";
// Approved export only. Do not read old public d4_homepage_builds.
const entries=manifest.entries as D4Build[];
export async function getHomepageBuilds(season:number=TARGET_D4_SEASON):Promise<D4Build[]>{
 return isKnownSeason(season)?entries.filter(e=>e.season===season):[];
}
export async function getHomepageBuildBySlug(slug:string):Promise<D4Build|null>{
 const matches=entries.filter(e=>isKnownSeason(e.season)&&e.slug===slug);
 return matches.length===1?matches[0]:null;
}
export async function getBuildBySlug(slug:string){return getHomepageBuildBySlug(slug)}
export async function getBuildsBySeason(season:number){return getHomepageBuilds(season)}
