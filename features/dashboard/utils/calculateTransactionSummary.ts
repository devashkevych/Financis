import { Transaction } from "@/lib/types/transactions";

export default function calculateTransactionSummary(
  transactions: Transaction[],
) {
  const totalIncomes = transactions
    .filter((transaction) => transaction.type === "Income")
    .map((t) => t.amount)
    .reduce((acc, cur) => acc + cur, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "Expense")
    .map((t) => t.amount)
    .reduce((acc, cur) => acc + cur, 0);

  const totalBalance = totalIncomes - totalExpenses;

  return { totalBalance, totalExpenses, totalIncomes };
}
