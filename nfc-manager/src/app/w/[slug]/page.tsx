import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Wifi } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import CopyButton from "@/components/CopyButton";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Acesso Wi-Fi", robots: { index: false, follow: false } };
export default async function WifiPublicPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const supabase=createAdminClient();
 const {data:card}=await supabase.from("nfc_cards").select("type,business_name,wifi_ssid,wifi_password").eq("slug",slug).eq("type","wifi").maybeSingle();
 if(!card||!card.wifi_ssid||!card.wifi_password)notFound();
 return <main className="public-shell"><article className="public-card">
  <div className="public-icon"><Wifi size={36}/></div>
  <p className="eyebrow" style={{textAlign:"center",margin:"0 0 7px"}}>BEM-VINDO(A)</p>
  <h1 style={{fontSize:25,textAlign:"center",margin:"0 0 9px",lineHeight:1.2}}>{card.business_name}</h1>
  <p className="muted" style={{fontSize:15,textAlign:"center",margin:"0 0 24px"}}>Acesse já nosso Wi-Fi!</p>
  <div className="copy-box" style={{marginBottom:12}}><p className="eyebrow" style={{margin:"0 0 8px"}}>NOME DA REDE WI-FI</p><p style={{fontWeight:800,fontSize:17,margin:0,overflowWrap:"anywhere"}}>{card.wifi_ssid}</p></div>
  <div className="copy-box" style={{marginBottom:14}}><p className="eyebrow" style={{margin:"0 0 8px"}}>SENHA DO WI-FI</p><p style={{fontWeight:800,fontSize:17,letterSpacing:1,margin:0,overflowWrap:"anywhere"}}>{card.wifi_password}</p></div>
  <CopyButton value={card.wifi_password} label="COPIAR SENHA"/>
  <p className="muted" style={{fontSize:11,textAlign:"center",lineHeight:1.5,margin:"15px 0 0"}}>Copie a senha e conecte-se à rede informada acima.</p>
 </article></main>;
}
