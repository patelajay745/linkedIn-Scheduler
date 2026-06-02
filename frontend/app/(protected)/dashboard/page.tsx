"use client";
import { Error } from "@/components/Custom/Error";
import { Loader } from "@/components/Custom/Loader";
import { PostCard } from "@/components/Custom/posts/PostCard";
import { Button } from "@/components/retroui/Button";
import { Empty } from "@/components/retroui/Empty";
import { useDeletePost } from "@/hooks/useDeletePost";
import { usePost } from "@/hooks/usePost";
import { useRouter } from "next/navigation";

const DashBoardPage = () => {
  const { data, isLoading, isError } = usePost();
  const { mutate: deletePost, isPending } = useDeletePost();
  const router = useRouter();

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

  const handleDeletePost = (id: string) => {
    deletePost(id);
  };

  const handleCreateButton = () => {
    router.push("/posts/new");
  };

  const handleEditButton = (id: string) => {
    router.push(`/posts/${id}/edit`);
  };

  return (
    <>
      <Button onClick={handleCreateButton}>Create</Button>
      {data?.posts?.length ? (
        data.posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onEdit={() => handleEditButton(post.id)}
            onDelete={() => handleDeletePost(post.id)}
          />
        ))
      ) : (
        <Empty>
          <Empty.Content>
            <Empty.Icon className="size-10 md:size-12" />
            <Empty.Title>No Results</Empty.Title>
            <Empty.Separator />
            <Empty.Description>
              You don't have any post to show
            </Empty.Description>
          </Empty.Content>
        </Empty>
      )}
    </>
  );
};

export default DashBoardPage;
