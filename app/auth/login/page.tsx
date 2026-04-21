"use client";

import AuthForm from "@/components/AuthForm";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    router.push("/transactions");
  };

  return (
    <div>
      <AuthForm authAction={loginUser} title="Log In" />
    </div>
  );
}