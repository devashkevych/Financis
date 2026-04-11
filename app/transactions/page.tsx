"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Transaction } from "@/types/transactions";
import TransactionCard from "@/components/transactions/TransactionCard";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingError, setDeletingError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const sessionRetrieve = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error(error);
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    sessionRetrieve();
  }, []);

  const fetchTransactions = async () => {
    if (!user) return;

    setIsFetching(true);
    setFetchingError(null);

    try {
      const { data, error } = await supabase
        .from("Transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      setTransactions(data ?? []);
    } catch (err) {
      setFetchingError("Failed to fetch transactions");
      return;
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const deleteTransaction = async (id: number) => {
    try {
      setTransactions((prev) =>
        prev.filter((transaction) => {
          return transaction.id !== id;
        }),
      );

      const { data, error } = await supabase
        .from("Transactions")
        .delete()
        .eq("id", id)
        .select();

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    router.push("/auth/login");
  };

  return (
    <div className="relative min-h-screen">
      {isAddModalOpen && user && (
        <AddTransactionModal
          userId={user?.id}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          onSuccess={fetchTransactions}
        />
      )}
      <h1>Transactions</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      <button
        className="border rounded p-4"
        onClick={() => {
          setIsAddModalOpen(true);
        }}
      >
        +
      </button>

      {deletingError && <p>{deletingError}</p>}
      {isFetching && <p>Loading your transactions...</p>}
      {fetchingError && <p>{fetchingError}</p>}
      {!isFetching && !fetchingError && transactions.length === 0 && (
        <p>No transactions yet...</p>
      )}
      {!isFetching && !fetchingError && transactions.length > 0 && (
        <ul className="flex flex-col mt-4">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard
                transaction={transaction}
                onDelete={deleteTransaction}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
