"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn, Wifi } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError("E-mail ou senha incorretos. Confira os dados e tente novamente."); return; }
    router.replace("/admin"); router.refresh();
  }
  return <main className="public-shell"><form onSubmit={submit} className="panel" style={{width:"min(420px,100%)",padding:30}}>
    <div className="public-icon"><Wifi size={30}/></div><p className="eyebrow" style={{textAlign:"center"}}>PAINEL ADMINISTRATIVO</p><h1 style={{fontSize:25,textAlign:"center",margin:"8px 0 5px"}}>NFC Manager</h1><p className="muted" style={{textAlign:"center",fontSize:14,margin:"0 0 25px"}}>Entre para gerenciar suas plaquinhas.</p>
    <div className="field" style={{marginBottom:15}}><label>E-mail</label><input className="input" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com"/></div>
    <div className="field" style={{marginBottom:18}}><label>Senha</label><input className="input" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></div>
    {error&&<p className="danger-text" style={{fontSize:13}}>{error}</p>}
    <button className="btn btn-primary" disabled={loading} style={{width:"100%"}}><LogIn size={17}/>{loading?"Entrando...":"Entrar no painel"}</button>
    <p className="muted" style={{fontSize:11,textAlign:"center",marginTop:18}}><LockKeyhole size={12} style={{display:"inline",verticalAlign:"middle"}}/> Acesso restrito ao administrador.</p>
  </form></main>;
}
