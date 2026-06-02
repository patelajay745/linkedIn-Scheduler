import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetPost = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: () => api.get(`/posts/${id}`).then((response) => response.data),
  });
  return { data, isLoading, isError };
};
