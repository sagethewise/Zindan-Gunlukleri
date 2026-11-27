import BuildDetailContent from "@/components/builds/BuildDetailContent";
export default async function Page({params}:{params:Promise<{slug:string}>}){return <BuildDetailContent params={params}/>;}
