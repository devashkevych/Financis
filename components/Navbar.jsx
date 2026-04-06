import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-8 pb-4">
      <Link href="/auth/login">Log In</Link>
      <Link href="/auth/signup">Sign Up</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
