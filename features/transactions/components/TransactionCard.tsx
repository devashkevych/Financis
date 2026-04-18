import { Transaction } from "@/lib/types/transactions";

type TransactionCardProps = {
  transaction: Transaction;
  onDelete: (id: number) => Promise<void>;
};

export default function TransactionCard({
  transaction,
  onDelete,
}: TransactionCardProps) {
  return (
    <div className="flex justify-between border-b border-gray-600 py-2 px-4 md:mx-16">
      <p>{transaction.amount}</p>
      <p>{transaction.date}</p>
      <p>{transaction.type}</p>
      <p>{transaction.category}</p>
      <button onClick={() => onDelete(transaction.id)}>
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
  );
}
