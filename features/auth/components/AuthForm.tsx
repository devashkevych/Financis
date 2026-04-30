"use client";

import { useState } from "react";
import AuthInput from "./AuthInput";
import Button from "@/components/Button";
import Link from "next/link";

type AuthFormProps = {
  authAction: (email: string, password: string) => Promise<void>;
  title: "Log In" | "Sign Up";
  mode: "login" | "signup";
};

export default function AuthForm({ authAction, title, mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (typeof email !== "string" || typeof password !== "string") {
        throw new Error("Invalid form data");
      }
      await authAction(email, password);
    } catch (e: any) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center gap-8">
      <h2 className="border-b border-gray-600 w-3/4 text-center text-4xl font-bold pb-4 mt-4">
        Financis
      </h2>
      <h3 className="font-semibold text-3xl mt-32">{title}</h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-center"
      >
        <AuthInput label="E-mail" type="text" name="email" />
        <AuthInput label="Password" type="password" name="password" />
        <Button loading={loading} title={title} type="submit" />
      </form>
      <span className="text-slate-400">
        {mode === "signup"
          ? "Already have an account?"
          : "Don't have an account?"}{" "}
        {""}
        <Link
          href={mode === "signup" ? `/auth/login` : `/auth/signup`}
          className="text-amber-400"
        >
          {mode === "signup" ? "Log In" : "Sign Up"}
        </Link>
      </span>
      {error && <h2 className="text-red-400">{error}</h2>}
      {loading ? "Loading..." : ""}
    </section>
  );
}
