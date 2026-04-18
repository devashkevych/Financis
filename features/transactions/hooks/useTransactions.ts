import { Transaction } from "@/lib/types/transactions";
import { useState, useEffect } from "react";
import getTransactions from "@/lib/services/getTransactions";
import deleteTransactionById from "@/lib/services/deleteTransactionById";

export default function useTransactions(userId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const [deletingError, setDeletingError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!userId) return;

    setIsFetching(true);
    setFetchingError(null);

    try {
      const { data, error } = await getTransactions(userId);

      if (error) throw error;

      setTransactions(data ?? []);
    } catch (err) {
      setFetchingError("Failed to fetch transactions");
      return;
    } finally {
      setIsFetching(false);
    }
  };

  const filterTransactions = (id: number) => {
    setTransactions((prev) =>
      prev.filter((transaction) => {
        return transaction.id !== id;
      }),
    );
  };

  const deleteTransaction = async (id: number) => {
    try {
      filterTransactions(id);

      const { data, error } = await deleteTransactionById(id);

      if (error) {
        await fetchTransactions();
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        await fetchTransactions();
        throw new Error("Transaction was not deleted");
      }
    } catch (err) {
      if (err instanceof Error) {
        setDeletingError(err.message);
      } else {
        setDeletingError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  return {
    transactions,
    isFetching,
    fetchingError,
    deletingError,
    fetchTransactions,
    deleteTransaction,
  };
}
