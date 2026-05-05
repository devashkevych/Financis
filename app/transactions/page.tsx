"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TransactionCard from "@/features/transactions/components/TransactionCard";
import AddTransactionModal from "@/features/transactions/components/AddTransactionModal";
import useTransactions from "@/features/transactions/hooks/useTransactions";
import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import groupTransactions from "@/lib/services/groupTransactions";

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

  const groupedTransactions = Object.entries(groupTransactions(transactions));
  console.log(Object.values(groupedTransactions));

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
      <div className="flex flex-col justify-center items-center gap-8">
        <h2 className="border-b border-gray-600 w-3/4 text-center text-4xl font-bold pb-4 mt-4">
          Financis
        </h2>
        <button onClick={handleSignOut}>Sign Out</button>
        <button
          className="fixed bg-[#763DA8] text-xl font-bold rounded border border-gray-600 p-4 bottom-16 right-12 size-16 active:bg-[#673296] active:border-[#592685]"
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
          <ul className="flex flex-col mt-4 gap-8">
            {groupedTransactions.map(([date, trans]) => (
              <div key={date} className="flex flex-col gap-4">
                <div>{date}</div>
                <div>
                  {" "}
                  {trans.map((transaction) => (
                    <li key={transaction.id}>
                      <TransactionCard
                        transaction={transaction}
                        onDelete={deleteTransaction}
                      />
                    </li>
                  ))}
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
