import { supabase } from "@/lib/supabaseClient";

export default async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from("Transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  return { data, error };
}
