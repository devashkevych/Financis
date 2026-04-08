"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  user_id: string;
  created_at: string;
  date: string;
  amount: number;
  type: TransactionType;
  category: string;
}

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
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!user) return;

    setIsFetching(true);
    setError(null);

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
        setError("Failed to fetch transactions");
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
    setError(null);

    try {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (form.amount.trim() === "" || Number(form.amount) <= 0)
        throw new Error("Wrong amount. Please write amount more than 0");

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
        setError(error.message);
      } else {
        setError("Something went wrong");
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
      <form onSubmit={handleSubmit}>
        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) => {
            setForm({ ...form, type: e.target.value as TransactionType });
          }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {/* AMOUNT */}
        <input
          type="number"
          value={form.amount}
          onChange={(e) => {
            setForm({ ...form, amount: e.target.value });
          }}
        />
        {/* Category */}
        <input
          type="text"
          value={form.category}
          onChange={(e) => {
            setForm({ ...form, category: e.target.value });
          }}
        />
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
      {error && <p>{error}</p>}
      {isSubmitting && <p>Submitting your transaction...</p>}
      {!isFetching && !error && transactions.length > 0 && (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <div>
                <p>{transaction.amount}</p>
                <p>{transaction.created_at}</p>
                <p>{transaction.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
