"use client";

import { Error } from "@/components/Custom/Error";
import { Loader } from "@/components/retroui/Loader";
import { EditPostForm } from "@/components/Custom/posts/EditPostForm";
import { useGetPost } from "@/hooks/useGetPost";
import { Post } from "@/types";
import { useParams } from "next/navigation";

const EditPostPage = () => {
  const { id } = useParams() as { id: string };
  const { data, isLoading, isError } = useGetPost(id) as {
    data: { post: Post };
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader count={4} duration={0.8} delayStep={120} className="" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Error />
      </div>
    );
  }

  return <EditPostForm post={data.post} />;
};

export default EditPostPage;
