import {NextRequest,NextResponse} from "next/server";
import {TARGET_D4_SEASON,isKnownSeason} from "@/lib/constants";
export async function GET(req:NextRequest){
 const q=req.nextUrl.searchParams,season=Number(q.get("season")??TARGET_D4_SEASON);
 if(!isKnownSeason(season))return NextResponse.json({items:[],total:0},{status:404});
 const page=Math.max(1,Number(q.get("page"))||1),limit=Math.max(1,Math.min(100,Number(q.get("limit"))||60));
 return NextResponse.json({items:[],page,limit,total:0},{headers:{"Cache-Control":"no-store"}});
}
