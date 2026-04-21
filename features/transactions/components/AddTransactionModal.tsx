import { useState } from "react";
import { TransactionCategory, TransactionType } from "@/lib/types/transactions";
import createTransaction from "../../../lib/services/createTransaction";

type FormState = {
  type: TransactionType;
  amount: string;
  category: TransactionCategory;
  date: string;
};

type AddTransactionModalProps = {
  userId: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
};

export default function AddTransactionModal({
  userId,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const INITIAL_FORM: FormState = {
    type: "Expense",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState<string | null>(null);

  const validateForm = (form: FormState): string | null =>
    form.amount.trim() === "" || Number(form.amount) <= 0
      ? "Wrong amount. Please write amount more than 0"
      : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmittingError(null);

    try {
      const validationError = validateForm(form);
      if (validationError) return setSubmittingError(validationError);

      const payload = {
        user_id: userId,
        date: form.date,
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
      };

      const { error: insertError } = await createTransaction(payload);

      if (insertError) throw new Error(insertError.message);

      await onSuccess();
      onClose();

      setForm(INITIAL_FORM);
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
    <div className="absolute z-60 bg-slate-700 h-88 px-8  rounded-xl">
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
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
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
      <button className="absolute top-4 right-4" onClick={() => onClose()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e3e3e3"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
      {submittingError && <p className="mt-4">{submittingError}</p>}
    </div>
  );
}
