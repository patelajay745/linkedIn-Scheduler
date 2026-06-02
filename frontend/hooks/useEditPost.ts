import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: {
        content?: string;
        imageUrls?: string[];
        scheduledAt: string;
      };
      id: string;
    }) => api.patch(`/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    isPending,
    isSuccess,
    mutate,
  };
};
