export type TransactionType = "Income" | "Expense";

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Gift",
  "Investment",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Subscriptions",
  "Entertainment",
  "Other",
] as const;

export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

type BaseTransaction = {
  id: number;
  user_id: string;
  created_at: string;
  date: string;
  amount: number;
};

export type Transaction =
  | (BaseTransaction & {
      type: "Expense";
      category: ExpenseCategory;
    })
  | (BaseTransaction & {
      type: "Income";
      category: IncomeCategory;
    });
