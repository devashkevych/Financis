'use client'

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-1 bottom-0 w-dvw md:static md:top-0">
      <div className="flex gap-8 pb-4 justify-around">
        <Link href="/auth/login">Log In</Link>
        <Link href="/auth/signup">Sign Up</Link>
        <Link href="/transactions">Transactions</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
