import { Transaction } from "@/lib/types/transactions";

type TransactionCardProps = {
  transaction: Transaction;
  onDelete?: (id: number) => Promise<void>;
};

export default function TransactionCard({
  transaction,
  onDelete,
}: TransactionCardProps) {
  return (
    <div className="flex justify-between border-t border-gray-600 py-2 px-4 md:mx-16 gap-8">
      <p>{transaction.category}</p>
      <div className="flex gap-4">
        <p
          className={
            transaction.type === "Expense" ? "text-red-500" : "text-green-500"
          }
        >
          ${transaction.amount}
        </p>
        <button
          className={onDelete ? "cursor-pointer" : "hidden"}
          onClick={() => {
            if (onDelete) onDelete(transaction.id);
          }}
        >
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
      </div>
    </div>
  );
}
