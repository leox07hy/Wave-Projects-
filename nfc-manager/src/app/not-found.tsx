import Link from "next/link";
import { AlertCircle } from "lucide-react";
export default function NotFound(){return <main className="public-shell"><section className="public-card" style={{textAlign:"center"}}><div className="public-icon"><AlertCircle size={32}/></div><h1 style={{fontSize:23}}>Página não encontrada</h1><p className="muted" style={{fontSize:14}}>Este link pode estar incorreto ou o cadastro foi desativado.</p><Link href="/" className="btn btn-secondary" style={{marginTop:12}}>Voltar</Link></section></main>}
