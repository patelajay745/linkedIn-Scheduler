"use client";
import { Error } from "@/components/Custom/Error";
import { Loader } from "@/components/Custom/Loader";
import { useGetPost } from "@/hooks/useGetPost";
import { Post } from "@/types";
import { useParams } from "next/navigation";

const EditPostPage = () => {
  const { id } = useParams() as { id: string };
  const { data, isLoading, isError } = useGetPost(id) as {
    data: Post;
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Error />
      </div>
    );
  }
};
export default EditPostPage;
