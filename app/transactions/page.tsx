"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { TransactionType, Transaction } from "@/types/transactions";
import TransactionCard from "@/components/TransactionCard";

interface FormState {
  type: TransactionType;
  amount: string;
  category: string;
  date: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    type: "expense",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingError, setFetchingError] = useState<string | null>(null);
  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    if (!user) return;

    setIsFetching(true);
    setFetchingError(null);

    const fetchTransactions = async () => {
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

    fetchTransactions();
  }, [user]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    router.push("/auth/login");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmittingError(null);

    try {
      if (!user) {
        setSubmittingError("User not authenticated");
        return;
      }

      if (form.amount.trim() === "" || Number(form.amount) <= 0)
        throw new Error("Wrong amount. Please write amount more than 0");

      if (form.category.trim() === "")
        throw new Error("Wrong category. Please write right category");

      const payload = {
        user_id: user.id,
        date: form.date,
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
      };

      const { data: insertData, error: insertError } = await supabase
        .from("Transactions")
        .insert([payload])
        .select();

      if (insertError) throw new Error(insertError.message);
      console.log(insertData);

      setTransactions((prev) => [...prev, ...insertData]);
      setForm({
        type: "expense",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      if (error instanceof Error) {
        setSubmittingError(error.message);
      } else {
        setSubmittingError("Something went wrong");
      }

      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Transactions</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-8">
        {/* TYPE */}
        <div className="flex gap-4">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => {
              setForm({ ...form, type: e.target.value as TransactionType });
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        {/* AMOUNT */}
        <div className="flex gap-4">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={form.amount}
            onChange={(e) => {
              setForm({ ...form, amount: e.target.value });
            }}
            placeholder="0.00"
          />
        </div>
        {/* Category */}
        <div className="flex gap-4">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => {
              setForm({ ...form, category: e.target.value });
            }}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Rent">Rent</option>
          </select>
        </div>
        {/* Date */}
        <input
          type="date"
          value={form.date}
          onChange={(e) => {
            setForm({ ...form, date: e.target.value });
          }}
        />
        <button type="submit">Add</button>
      </form>
      {isFetching && <p>Loading your transactions...</p>}
      {fetchingError && <p>{fetchingError}</p>}
      {!isFetching && !fetchingError && transactions.length === 0 && (
        <p>No transactions yet...</p>
      )}
      {submittingError && <p>{submittingError}</p>}
      {}
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
