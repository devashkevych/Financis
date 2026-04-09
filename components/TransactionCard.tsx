import { Transaction } from "@/types/transactions";

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
      <div className="flex justify-between border-b border-gray-600 py-2 px-4 md:mx-16">
        <p>{transaction.amount}</p>
        <p>{transaction.date}</p>
        <p>{transaction.type}</p>
        <p>{transaction.category}</p>
      </div>
  );
}
