import { api } from "@/lib/api";
import { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UsePostParams {
  from: string;
  to: string;
}

export const usePost = ({ from, to }: UsePostParams) => {
  const { data, isLoading, isError } = useQuery<{
    posts: Post[];
    count: number;
  }>({
    queryKey: ["posts", from, to],
    queryFn: () => api.get("/posts", { params: { from, to } }).then((res) => res.data),
  });

  return { data, isLoading, isError };
};
