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

  const [user, setUser] = useState<User | null>(null);

  console.log(isAddModalOpen);
  const sessionRetrieve = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log(user);

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    router.push("/auth/login");
  };

  return (
    <div className="relative h-screen">
      {isAddModalOpen && (
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

      {isFetching && <p>Loading your transactions...</p>}
      {fetchingError && <p>{fetchingError}</p>}
      {!isFetching && !fetchingError && transactions.length === 0 && (
        <p>No transactions yet...</p>
      )}
      {!isFetching && !fetchingError && transactions.length > 0 && (
        <ul className="flex flex-col mt-4">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard transaction={transaction} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
