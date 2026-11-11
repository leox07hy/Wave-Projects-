import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CardForm from "@/components/CardForm";
export default async function EditCardPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const supabase=await createClient();const {data:card}=await supabase.from("nfc_cards").select("*").eq("id",id).single();if(!card)notFound();
 return <main className="container" style={{paddingTop:32,paddingBottom:60}}><CardForm card={card}/></main>;
}
