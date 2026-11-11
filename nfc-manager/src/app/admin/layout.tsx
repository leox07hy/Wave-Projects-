import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Wifi } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <><header className="topbar"><div className="container" style={{height:68,display:"flex",alignItems:"center",justifyContent:"space-between",gap:15}}>
    <Link href="/admin" style={{display:"flex",alignItems:"center",gap:10,fontWeight:800}}><span style={{background:"#e7f8ef",color:"#129b63",width:36,height:36,borderRadius:11,display:"grid",placeItems:"center"}}><Wifi size={20}/></span>NFC Manager</Link>
    <div style={{display:"flex",alignItems:"center",gap:14}}><span className="muted" style={{fontSize:12}}>{user.email}</span><LogoutButton/></div>
  </div></header>{children}</>;
}
