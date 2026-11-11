import Link from "next/link";
import { Plus, Search, Wifi, QrCode, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { publicUrl, formatDate } from "@/lib/utils";

export default async function AdminPage(){
 const supabase=await createClient();
 const {data:cards,error}=await supabase.from("nfc_cards").select("id,type,slug,business_name,created_at,updated_at").order("created_at",{ascending:false});
 const all=cards||[];const pix=all.filter(c=>c.type==="pix").length;const wifi=all.filter(c=>c.type==="wifi").length;
 return <main className="container" style={{paddingTop:34,paddingBottom:60}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:15,flexWrap:"wrap",marginBottom:25}}><div><p className="eyebrow">VISÃO GERAL</p><h1 style={{fontSize:27,margin:"5px 0"}}>Minhas plaquinhas</h1><p className="muted" style={{fontSize:13,margin:0}}>Gerencie os links de PIX e Wi-Fi dos seus clientes.</p></div><Link href="/admin/novo" className="btn btn-primary"><Plus size={17}/> Novo cadastro</Link></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:13,marginBottom:24}}>{[{label:"Total de cadastros",value:all.length,icon:<QrCode size={20}/>},{label:"Plaquinhas PIX",value:pix,icon:<span style={{fontWeight:900}}>₱</span>},{label:"Plaquinhas Wi-Fi",value:wifi,icon:<Wifi size={20}/>}].map((item,i)=><div className="panel" key={i} style={{padding:18}}><div style={{color:"#129b63",marginBottom:10}}>{item.icon}</div><div style={{fontSize:27,fontWeight:800}}>{item.value}</div><div className="muted" style={{fontSize:12}}>{item.label}</div></div>)}</div>
  <section className="panel"><div style={{padding:"18px 20px",borderBottom:"1px solid #edf0f4",display:"flex",justifyContent:"space-between",alignItems:"center"}}><strong>Cadastros realizados</strong><span className="muted" style={{fontSize:12}}>{all.length} registro(s)</span></div>
   {error?<p style={{padding:20}} className="danger-text">Erro ao carregar cadastros. Verifique a configuração do banco de dados.</p>:all.length===0?<div style={{padding:45,textAlign:"center"}}><div style={{color:"#129b63",marginBottom:12}}><QrCode size={34} style={{margin:"auto"}}/></div><h3 style={{margin:"0 0 7px"}}>Nenhuma plaquinha cadastrada</h3><p className="muted" style={{fontSize:13}}>Comece criando seu primeiro link de PIX ou Wi-Fi.</p><Link className="btn btn-primary" href="/admin/novo" style={{marginTop:10}}><Plus size={16}/> Criar primeiro cadastro</Link></div>:<div className="table-wrap"><table><thead><tr><th>Estabelecimento</th><th>Tipo</th><th>Cadastro</th><th>Link</th><th></th></tr></thead><tbody>{all.map(card=><tr key={card.id}><td style={{fontWeight:700}}>{card.business_name}</td><td><span className={`type-pill ${card.type==="pix"?"type-pix":"type-wifi"}`}>{card.type.toUpperCase()}</span></td><td>{formatDate(card.created_at)}</td><td><a href={publicUrl(card.type,card.slug)} target="_blank" rel="noreferrer" style={{color:"#168657",display:"inline-flex",alignItems:"center",gap:5}}><ExternalLink size={13}/> Abrir link</a></td><td><Link className="btn btn-secondary" style={{padding:"7px 10px",fontSize:12}} href={`/admin/${card.id}`}>Gerenciar</Link></td></tr>)}</tbody></table></div>}
  </section>
  <p className="muted" style={{fontSize:11,marginTop:16}}>Os links são permanentes: editar os dados não altera o endereço já gravado nas plaquinhas.</p>
 </main>;
}
