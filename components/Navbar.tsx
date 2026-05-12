"use client";

import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";

export default function Navbar() {
  const { user } = useUser();
  const isLogged = !!user;

  return (
    <nav
      className={
        isLogged
          ? `fixed z-1 bottom-0 left-0 w-dvw md:static md:top-0 w-full bg-[#231c2c] pt-4`
          : "hidden"
      }
    >
      <div className="flex gap-8 pb-4 justify-around">
        <Link href="/transactions">Transactions</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
