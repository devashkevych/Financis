"use client";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import calculateTransactionSummary from "@/features/dashboard/utils/calculateTransactionSummary";
import useTransactions from "@/features/transactions/hooks/useTransactions";

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();
  const { transactions } = useTransactions(user?.id);
  const router = useRouter();

  const { totalBalance, totalIncomes, totalExpenses } =
    calculateTransactionSummary(transactions);

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
      <div>Total Balance: {totalBalance}</div>
      <div>Total Incomes: {totalIncomes}</div>
      <div>Total Expenses: {totalExpenses}</div>
    </div>
  );
}
