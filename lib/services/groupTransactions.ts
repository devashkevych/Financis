import { Transaction } from "../types/transactions";

export default function groupTransactions(transactions: Transaction[]) {
  const grouped = transactions.reduce<Record<string, Transaction[]>>(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }

      acc[item.date].push(item);
      return acc;
    },
    {},
  );

  return grouped;
}
