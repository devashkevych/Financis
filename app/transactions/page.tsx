"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TransactionCard from "@/features/transactions/components/TransactionCard";
import AddTransactionModal from "@/features/transactions/components/AddTransactionModal";
import useTransactions from "@/features/transactions/hooks/useTransactions";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";

export default function TransactionsPage() {
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useRequireAuth();

  const {
    transactions,
    isFetching,
    fetchingError,
    fetchTransactions,
    deleteTransaction,
    deletingError,
  } = useTransactions(user?.id);

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
