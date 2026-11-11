"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
export default function DeleteCardButton({id}:{id:string}){
 const [loading,setLoading]=useState(false);const router=useRouter();
 async function remove(){if(!confirm("Excluir este cadastro? O link público deixará de funcionar. Esta ação não pode ser desfeita."))return;setLoading(true);const {error}=await createClient().from("nfc_cards").delete().eq("id",id);setLoading(false);if(error){alert("Não foi possível excluir o cadastro.");return;}router.replace("/admin");router.refresh();}
 return <button className="btn btn-danger" onClick={remove} disabled={loading}><Trash2 size={16}/>{loading?"Excluindo...":"Excluir cadastro"}</button>;
}
