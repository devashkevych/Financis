"use client";

import { useRequireAuth } from "@/lib/hooks/useRequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import calculateTransactionSummary from "@/features/dashboard/utils/calculateTransactionSummary";
import useTransactions from "@/features/transactions/hooks/useTransactions";
import groupTransactions from "@/lib/services/groupTransactions";
import TransactionCard from "@/features/transactions/components/TransactionCard";

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

  const groupedTransactions = Object.entries(
    groupTransactions(latestTransactions),
  );

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h2 className="border-b border-gray-600 w-3/4 text-center text-4xl font-bold pb-4 mt-4">
        Dashboard
      </h2>
      
      {isLoading && <p>Loading...</p>}
      {!isLoading && fetchingError && <p>{fetchingError}</p>}
      {!isLoading && !fetchingError && (
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col border w-fit p-4 rounded-xl font-bold text-lg">
              Total Balance:{" "}
              <span
                className={
                  totalBalance <= 0
                    ? "text-red-500 text-2xl"
                    : "text-green-500 text-2xl"
                }
              >
                ${totalBalance}
              </span>
            </div>
            <div className="flex gap-4 border w-fit p-4 rounded-xl text-md font-semibold mb-4">
              <div className="flex flex-col items-center border-r pr-4">
                Incomes{" "}
                <span
                  className={
                    totalIncomes === 0 ? "text-red-500" : "text-green-500"
                  }
                >
                  ${totalIncomes}
                </span>
              </div>
              <div className="flex flex-col items-center">
                Expenses{" "}
                <span
                  className={
                    totalExpenses > 0 ? "text-red-500" : "text-green-500"
                  }
                >
                  ${totalExpenses}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {latestTransactions.length === 0 ? (
              <p>No transactions yet</p>
            ) : (
              <ul className="flex flex-col mt-4 gap-8 w-full">
                {groupedTransactions.map(([date, trans]) => (
                  <div
                    key={date}
                    className="flex flex-col gap-2 border-b border-gray-600 font-semibold"
                  >
                    <div className="pl-6">{date}</div>
                    <div>
                      {" "}
                      {trans.map((transaction) => (
                        <li key={transaction.id}>
                          <TransactionCard transaction={transaction} />
                        </li>
                      ))}
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
