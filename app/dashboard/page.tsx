"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

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

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
