import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

export function useRequireAuth() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login");
  }, [user, isLoading]);

  return { user, isLoading };
}
