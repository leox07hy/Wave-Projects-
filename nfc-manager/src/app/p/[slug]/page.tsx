import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QrCode } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pagamento PIX", robots: { index: false, follow: false } };
export default async function PixPublicPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const supabase=createAdminClient();
 const {data:card}=await supabase.from("nfc_cards").select("type,business_name,pix_holder,pix_key,pix_copy_paste").eq("slug",slug).eq("type","pix").maybeSingle();
 if(!card||!card.pix_copy_paste)notFound();
 return <main className="public-shell"><article className="public-card">
  <div className="public-icon"><QrCode size={34}/></div>
  <p className="eyebrow" style={{textAlign:"center",margin:"0 0 7px"}}>PAGAMENTO VIA PIX</p>
  <h1 style={{fontSize:25,textAlign:"center",margin:"0 0 8px",lineHeight:1.2}}>{card.business_name}</h1>
  <p className="muted" style={{fontSize:14,textAlign:"center",margin:"0 0 23px"}}>Faça seu pagamento de forma rápida e prática.</p>
  {card.pix_holder&&<div style={{marginBottom:16}}><p className="eyebrow">RECEBEDOR</p><p style={{fontWeight:700,margin:"5px 0"}}>{card.pix_holder}</p></div>}
  <div className="copy-box" style={{marginBottom:14}}><p className="eyebrow" style={{margin:"0 0 8px"}}>PIX COPIA E COLA</p><p style={{fontSize:12,lineHeight:1.55,margin:0,color:"#475467",maxHeight:85,overflow:"hidden",overflowWrap:"anywhere"}}>{card.pix_copy_paste}</p></div>
  <CopyButton value={card.pix_copy_paste} label="COPIAR PIX"/>
  <p className="muted" style={{fontSize:11,textAlign:"center",lineHeight:1.5,margin:"15px 0 0"}}>Copie o código e cole na opção PIX Copia e Cola do aplicativo do seu banco.</p>
 </article></main>;
}
