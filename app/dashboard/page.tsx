"use client";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import calculateTransactionSummary from "@/features/dashboard/utils/calculateTransactionSummary";
import useTransactions from "@/features/transactions/hooks/useTransactions";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth();

  const {
    transactions,
    isFetching: transactionsLoading,
    fetchingError,
  } = useTransactions(user?.id);

  const isLoading = authLoading || transactionsLoading;
  const router = useRouter();

  const { totalBalance, totalIncomes, totalExpenses } =
    calculateTransactionSummary(transactions);

  const latestTransactions = transactions.slice(0, 5);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
    router.push("/auth/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      {isLoading && <p>Loading...</p>}

      {!isLoading && fetchingError && <p>{fetchingError}</p>}

      {!isLoading && !fetchingError && (
        <div>
          <div>Total Balance: {totalBalance}</div>
          <div>Total Incomes: {totalIncomes}</div>
          <div>Total Expenses: {totalExpenses}</div>
          {latestTransactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <ul>
              {latestTransactions.map((t) => (
                <li key={t.id}>
                  <span>{t.amount}</span>
                  <span>{t.date}</span>
                  <span>{t.type}</span>
                  <span>{t.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
