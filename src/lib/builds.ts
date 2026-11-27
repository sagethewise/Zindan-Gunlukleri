"use server";
import {TARGET_D4_SEASON} from "@/lib/constants";
import type {D4Build} from "@/lib/types";
// The old public d4_homepage_builds import is retained in storage only.
// No reviewed Season 15/16 build artifact exists yet. Never relabel archival rows.
export async function getHomepageBuilds(_season:number=TARGET_D4_SEASON):Promise<D4Build[]>{return []}
export async function getHomepageBuildBySlug(_slug:string):Promise<D4Build|null>{return null}
export async function getBuildBySlug(slug:string){return getHomepageBuildBySlug(slug)}
export async function getBuildsBySeason(season:number){return getHomepageBuilds(season)}
