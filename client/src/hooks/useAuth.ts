import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  username: string;
  email?: string | null;
  firstName?: string | null;
  isAdmin?: boolean;
  adminRole?: string | null;
}

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        return null;
      }

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || "Authentication check failed");
      }

      return payload as AuthUser;
    },
    retry: false,
    staleTime: 30_000,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch,
  };
}
