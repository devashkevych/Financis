"use client";

import AuthForm from "@/components/AuthForm";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const signUpUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
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
      <AuthForm authAction={signUpUser} title="Create Account" />
    </div>
  );
}