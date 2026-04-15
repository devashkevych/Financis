export type TransactionType = "Income" | "Expense";

export type TransactionCategory = "Food" | "Transport" | "Rent";

export interface Transaction {
  id: number;
  user_id: string;
  created_at: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}
