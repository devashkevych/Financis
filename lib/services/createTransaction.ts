import { supabase } from "@/lib/supabaseClient";
import { TransactionCategory, TransactionType } from "../types/transactions";

type CreateTransactionPayload = {
  user_id: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
};

export default async function createTransaction(
  payload: CreateTransactionPayload,
) {
  const { data, error } = await supabase
    .from("Transactions")
    .insert([payload])
    .select();

  return { data, error };
}
