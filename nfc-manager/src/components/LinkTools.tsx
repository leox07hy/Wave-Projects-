"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, ExternalLink } from "lucide-react";
export default function LinkTools({url}:{url:string}){
 const [copied,setCopied]=useState(false);
 async function copy(){try{await navigator.clipboard.writeText(url);setCopied(true);window.setTimeout(()=>setCopied(false),2000)}catch{alert("Não foi possível copiar o link.")}}
 return <div style={{display:"flex",gap:22,alignItems:"center",flexWrap:"wrap"}}><div style={{background:"white",padding:12,border:"1px solid #e7ebf2",borderRadius:14}}><QRCodeSVG value={url} size={148} level="H" includeMargin/></div><div style={{flex:1,minWidth:220}}><p className="eyebrow">LINK PERMANENTE DA PLAQUINHA</p><p style={{fontSize:14,fontWeight:700,overflowWrap:"anywhere",lineHeight:1.5}}>{url}</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="btn btn-primary" onClick={copy}>{copied?<Check size={16}/>:<Copy size={16}/>}{copied?"Copiado":"Copiar link"}</button><a className="btn btn-secondary" href={url} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Abrir página</a></div><p className="muted" style={{fontSize:11,marginTop:12}}>Use este mesmo endereço na tag NFC e no QR Code físico.</p></div></div>;
}
