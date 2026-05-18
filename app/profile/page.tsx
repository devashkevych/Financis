"use client";

import { useUser } from "@/lib/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h2 className="border-b border-gray-600 w-3/4 text-center text-4xl font-bold pb-4 mt-4">
        Profile
      </h2>
      <main>
        <div>
          <p>E-mail: {user?.email}</p>
          <p>Creation date: {user?.created_at}</p>
        </div>
        <button className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </button>
      </main>
    </div>
  );
}
