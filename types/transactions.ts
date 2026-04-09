export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  user_id: string;
  created_at: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
}
