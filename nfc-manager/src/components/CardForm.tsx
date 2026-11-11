"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { createPermanentSlug } from "@/lib/utils";
import type { CardFormValues, NfcCard } from "@/lib/types";

const empty: CardFormValues = {type:"pix",business_name:"",pix_holder:"",pix_key:"",pix_key_type:"",pix_copy_paste:"",wifi_ssid:"",wifi_password:""};
export default function CardForm({ card }: {card?:NfcCard}){
 const router=useRouter(); const supabase=createClient();
 const [form,setForm]=useState<CardFormValues>(card?{
  type:card.type,business_name:card.business_name,pix_holder:card.pix_holder||"",pix_key:card.pix_key||"",pix_key_type:card.pix_key_type||"",pix_copy_paste:card.pix_copy_paste||"",wifi_ssid:card.wifi_ssid||"",wifi_password:card.wifi_password||""
 }:empty);
 const [loading,setLoading]=useState(false); const [error,setError]=useState("");
 function update<K extends keyof CardFormValues>(key:K,value:CardFormValues[K]){setForm(old=>({...old,[key]:value}));}
 async function submit(e:React.FormEvent){
  e.preventDefault();setError("");
  if(!form.business_name.trim()){setError("Informe o nome do estabelecimento.");return;}
  if(form.type==="pix"&&!form.pix_copy_paste.trim()){setError("Informe o PIX Copia e Cola.");return;}
  if(form.type==="wifi"&&(!form.wifi_ssid.trim()||!form.wifi_password.trim())){setError("Informe o nome da rede e a senha do Wi-Fi.");return;}
  setLoading(true);
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setError("Sua sessão expirou. Entre novamente.");setLoading(false);return;}
  const common={type:form.type,business_name:form.business_name.trim(),pix_holder:form.type==="pix"?(form.pix_holder.trim()||null):null,pix_key:form.type==="pix"?(form.pix_key.trim()||null):null,pix_key_type:form.type==="pix"?(form.pix_key_type||null):null,pix_copy_paste:form.type==="pix"?form.pix_copy_paste.trim():null,wifi_ssid:form.type==="wifi"?form.wifi_ssid.trim():null,wifi_password:form.type==="wifi"?form.wifi_password:null};
  // IMPORTANTE: em edição, slug e type não são atualizados. O endereço permanente é preservado.
  const result=card
   ? await supabase.from("nfc_cards").update({...common, type:card.type}).eq("id",card.id).eq("owner_id",user.id)
   : await supabase.from("nfc_cards").insert({...common,slug:createPermanentSlug(),owner_id:user.id});
  setLoading(false);
  if(result.error){setError(result.error.message.includes("unique")?"Falha ao gerar identificador. Tente salvar novamente.":"Não foi possível salvar. Confira a conexão e tente novamente.");return;}
  router.push(card?`/admin/${card.id}`:"/admin");router.refresh();
 }
 return <form onSubmit={submit} className="panel" style={{padding:24,maxWidth:720}}>
  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}><Link href={card?`/admin/${card.id}`:"/admin"} className="btn btn-secondary" style={{padding:9}}><ArrowLeft size={17}/></Link><div><h2 style={{margin:0,fontSize:20}}>{card?"Editar cadastro":"Novo cadastro"}</h2><p className="muted" style={{fontSize:12,margin:"4px 0 0"}}>{card?"Atualize os dados sem alterar o link existente.":"Escolha o tipo de plaquinha e informe os dados."}</p></div></div>
  {!card&&<div className="field" style={{marginBottom:18}}><label>Tipo de plaquinha</label><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><button type="button" className={`btn ${form.type==="pix"?"btn-primary":"btn-secondary"}`} onClick={()=>update("type","pix")}>PIX</button><button type="button" className={`btn ${form.type==="wifi"?"btn-primary":"btn-secondary"}`} onClick={()=>update("type","wifi")}>Wi-Fi</button></div></div>}
  {card&&<div className="toast" style={{marginBottom:18}}>Link permanente: editar este cadastro não altera o endereço já gravado na NFC/QR Code.</div>}
  <div className="field" style={{marginBottom:18}}><label>Nome do estabelecimento *</label><input className="input" required value={form.business_name} onChange={e=>update("business_name",e.target.value)} placeholder="Ex.: Restaurante do João"/></div>
  {form.type==="pix"?<>
   <p className="eyebrow" style={{margin:"22px 0 14px"}}>DADOS DO PIX</p>
   <div className="field" style={{marginBottom:16}}><label>Nome do titular (opcional)</label><input className="input" value={form.pix_holder} onChange={e=>update("pix_holder",e.target.value)} placeholder="Nome do recebedor"/></div>
   <div className="field" style={{marginBottom:16}}><label>Chave PIX (opcional)</label><input className="input" value={form.pix_key} onChange={e=>update("pix_key",e.target.value)} placeholder="CPF, CNPJ, telefone, e-mail ou aleatória"/></div>
   <div className="field" style={{marginBottom:16}}><label>Tipo de chave (opcional)</label><select className="input" value={form.pix_key_type} onChange={e=>update("pix_key_type",e.target.value as CardFormValues["pix_key_type"])}><option value="">Selecione</option><option value="cpf">CPF</option><option value="cnpj">CNPJ</option><option value="telefone">Telefone</option><option value="email">E-mail</option><option value="aleatoria">Aleatória</option></select></div>
   <div className="field" style={{marginBottom:8}}><label>PIX Copia e Cola *</label><textarea className="input" required rows={5} value={form.pix_copy_paste} onChange={e=>update("pix_copy_paste",e.target.value)} placeholder="Cole aqui o código PIX completo fornecido pelo cliente."/><span className="muted" style={{fontSize:11}}>O visitante terá um botão para copiar exatamente este código.</span></div>
  </>:<>
   <p className="eyebrow" style={{margin:"22px 0 14px"}}>DADOS DA REDE WI-FI</p>
   <div className="field" style={{marginBottom:16}}><label>Nome da rede Wi-Fi (SSID) *</label><input className="input" required value={form.wifi_ssid} onChange={e=>update("wifi_ssid",e.target.value)} placeholder="Ex.: WIFI_CLIENTES"/></div>
   <div className="field" style={{marginBottom:8}}><label>Senha do Wi-Fi *</label><input className="input" required value={form.wifi_password} onChange={e=>update("wifi_password",e.target.value)} placeholder="Senha da rede"/></div>
  </>}
  {error&&<p className="danger-text" style={{fontSize:13,marginTop:14}}>{error}</p>}
  <button className="btn btn-primary" disabled={loading} style={{width:"100%",marginTop:22,padding:14}}><Save size={17}/>{loading?"Salvando...":card?"Salvar alterações":"Cadastrar e gerar link"}</button>
 </form>;
}
