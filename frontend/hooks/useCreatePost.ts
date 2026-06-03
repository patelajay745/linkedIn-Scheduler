import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostPayload {
  content: string;
  imageUrls: string[];
  scheduledAt?: string;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: CreatePostPayload) => api.post(`/posts/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { mutate, isPending, isSuccess };
};
