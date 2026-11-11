import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Wifi, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { publicUrl, formatDate } from "@/lib/utils";
import LinkTools from "@/components/LinkTools";
import DeleteCardButton from "@/components/DeleteCardButton";
export default async function CardDetails({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const supabase=await createClient();const {data:card}=await supabase.from("nfc_cards").select("*").eq("id",id).single();if(!card)notFound();
 const url=publicUrl(card.type,card.slug);
 return <main className="container" style={{paddingTop:32,paddingBottom:60,maxWidth:900}}>
  <Link href="/admin" className="muted" style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:13,marginBottom:20}}><ArrowLeft size={16}/> Voltar aos cadastros</Link>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15,flexWrap:"wrap",marginBottom:20}}><div><p className="eyebrow">DETALHES DA PLAQUINHA</p><h1 style={{fontSize:27,margin:"5px 0"}}>{card.business_name}</h1><span className={`type-pill ${card.type==="pix"?"type-pix":"type-wifi"}`}>{card.type.toUpperCase()}</span></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Link href={`/admin/${id}/editar`} className="btn btn-primary"><Pencil size={16}/> Editar</Link><DeleteCardButton id={id}/></div></div>
  <section className="panel" style={{padding:22,marginBottom:18}}><h2 style={{fontSize:17,margin:"0 0 18px"}}>Link e QR Code</h2><LinkTools url={url}/></section>
  <section className="panel" style={{padding:22}}><h2 style={{fontSize:17,margin:"0 0 16px"}}>Informações cadastradas</h2>
   {card.type==="pix"?<div style={{display:"grid",gap:14}}><div><p className="eyebrow">TITULAR</p><p style={{margin:"5px 0"}}>{card.pix_holder||"Não informado"}</p></div><div><p className="eyebrow">CHAVE PIX</p><p style={{margin:"5px 0",overflowWrap:"anywhere"}}>{card.pix_key||"Não informada"}</p></div><div><p className="eyebrow">PIX COPIA E COLA</p><p style={{margin:"5px 0",fontSize:13,overflowWrap:"anywhere"}}>{card.pix_copy_paste}</p></div></div>:<div style={{display:"grid",gap:14}}><div><p className="eyebrow">NOME DA REDE</p><p style={{margin:"5px 0"}}>{card.wifi_ssid}</p></div><div><p className="eyebrow">SENHA</p><p style={{margin:"5px 0"}}>{card.wifi_password}</p></div></div>}
   <p className="muted" style={{fontSize:11,marginTop:22}}>Criado em {formatDate(card.created_at)} · Última atualização {formatDate(card.updated_at)}</p>
  </section>
 </main>;
}
