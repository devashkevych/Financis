"use client";

import { useState } from "react";

type AuthFormProps = {
  authAction: (email: string, password: string) => Promise<void>;
  title: string;
};

export default function AuthForm({ authAction, title }: AuthFormProps) {
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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : title}
      </button>
      {error && <h2>{error}</h2>}
    </form>
  );
}
