"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
export default function LogoutButton(){
 const router=useRouter();
 async function logout(){await createClient().auth.signOut();router.replace("/login");router.refresh();}
 return <button className="btn btn-secondary" onClick={logout} style={{padding:"8px 10px",fontSize:12}}><LogOut size={15}/> Sair</button>;
}
