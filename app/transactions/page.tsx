"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const sessionRetrieve = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      const { session } = data;

      if (error) {
        throw new Error(error.message);
      }

      if (!session) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    sessionRetrieve();
  }, [router]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    router.push("/auth/login");
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    const user = sessionData?.session?.user;

    const payload = {
      user_id: user?.id,
      date: form.date,
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("Transactions")
      .insert([payload]);
  };

  return (
    <main>
      <h1>Transactions</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      <form onSubmit={handleSubmit}>
        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) => {
            setForm({ ...form, type: e.target.value });
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
    </div>
  );
}
