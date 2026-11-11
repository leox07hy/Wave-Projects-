"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export default function CopyButton({ value, label="Copiar" }: {value:string;label?:string}){
 const [copied,setCopied]=useState(false);
 async function copy(){
  try{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),2200);}
  catch{alert("Não foi possível copiar automaticamente. Selecione e copie o conteúdo manualmente.");}
 }
 return <button className="btn btn-primary" onClick={copy} style={{width:"100%",padding:14}}>{copied?<><Check size={18}/> Copiado!</>:<><Copy size={18}/>{label}</>}</button>;
}
