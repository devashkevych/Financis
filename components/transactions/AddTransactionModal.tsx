import { useState } from "react";
import { TransactionCategory, TransactionType } from "@/types/transactions";
import { supabase } from "@/lib/supabaseClient";

interface FormState {
  type: TransactionType;
  amount: string;
  category: TransactionCategory;
  date: string;
}

interface AddTransactionModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function AddTransactionModal({
  userId,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const [form, setForm] = useState<FormState>({
    type: "Expense",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmittingError(null);

    try {
      if (form.amount.trim() === "" || Number(form.amount) <= 0)
        throw new Error("Wrong amount. Please write amount more than 0");

      const payload = {
        user_id: userId,
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

      await onSuccess();
      onClose();

      setForm({
        type: "Expense",
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      if (error instanceof Error) {
        setSubmittingError(error.message);
      } else {
        setSubmittingError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute z-50 bg-slate-700 h-88 px-8  rounded-xl">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-8">
        {/* TYPE */}
        <div className="flex gap-4 border-b w-full">
          <label htmlFor="type">Type:</label>
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
        <div className="flex gap-4 border-b w-full">
          <label htmlFor="amount">Amount:</label>
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
        <div className="flex gap-4 border-b w-full">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => {
              setForm({
                ...form,
                category: e.target.value as TransactionCategory,
              });
            }}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Rent">Rent</option>
          </select>
        </div>
        {/* Date */}
        <div className="flex w-full gap-4 border-b">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => {
              setForm({ ...form, date: e.target.value });
            }}
          />
        </div>
        <button
          className={`mx-auto px-8 py-4 rounded-xl mt-4 ${isSubmitting ? `bg-gray-400` : `bg-teal-700`}`}
          type="submit"
          disabled={isSubmitting}
        >
          Add
        </button>
      </form>
      {submittingError && <p className="mt-4">{submittingError}</p>}
    </div>
  );
}
