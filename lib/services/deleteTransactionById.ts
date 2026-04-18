import { supabase } from "@/lib/supabaseClient";

export default async function deleteTransactionById(id: number) {
  const { data, error } = await supabase
    .from("Transactions")
    .delete()
    .eq("id", id)
    .select();

  return { data, error };
}
