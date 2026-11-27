"use client";
import {useEffect,useState} from "react";
export default function GuideReaderNav({label,articleId}:{label:string;articleId:string}){
 const [headings,setHeadings]=useState<{id:string;text:string}[]>([]),[progress,setProgress]=useState(0);
 useEffect(()=>{const article=document.getElementById("dd-article");if(!article)return;setHeadings(Array.from(article.querySelectorAll("h2[id],h3[id]")).map(el=>({id:el.id,text:el.textContent??""})));const update=()=>{const b=article.getBoundingClientRect();setProgress(Math.max(0,Math.min(100,(-b.top+100)/Math.max(1,b.height-window.innerHeight+150)*100)))};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update)}},[articleId]);
 return <aside className="dd-reader-nav"><p className="dd-kicker">{label}</p><div className="dd-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{width:progress+"%"}}/></div><nav aria-label={label}>{headings.map(h=><a key={h.id} href={"#"+encodeURIComponent(h.id)}>{h.text}</a>)}</nav></aside>
}
