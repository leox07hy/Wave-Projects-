import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente privilegiado usado SOMENTE no servidor para resolver links públicos.
// Nunca importar este arquivo em Client Components.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Configuração do Supabase incompleta.");
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
