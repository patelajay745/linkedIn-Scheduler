import { api } from "@/lib/api";
import { UserType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery<UserType>({
    queryKey: ["auth"],
    queryFn: () => api.get("/auth/me").then((res) => res.data),
    retry: false,
  });

  return { user: data, isLoading, isError };
};
