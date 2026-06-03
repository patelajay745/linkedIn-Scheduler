"use client";
import { Error } from "@/components/Custom/Error";
import { Loader } from "@/components/Custom/Loader";
import { Content } from "@/components/Custom/posts/ContentInput";
import { EditPostForm } from "@/components/Custom/posts/EditPostForm";
import { useGetPost } from "@/hooks/useGetPost";
import { CreatePostInput, createPostSchema } from "@/lib/validators/postSchema";
import { Post } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

const EditPostPage = () => {
  const { id } = useParams() as { id: string };
  const { data, isLoading, isError } = useGetPost(id) as {
    data: { post: Post };
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

  return (
    <>
      <EditPostForm post={data.post} />
    </>
  );
};
export default EditPostPage;
