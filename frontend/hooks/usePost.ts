import { api } from "@/lib/api";
import { Post } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePost = () => {
  const { data, isLoading, isError } = useQuery<{
    posts: Post[];
    count: number;
  }>({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts").then((res) => res.data),
  });

  return { data, isLoading, isError };
};
