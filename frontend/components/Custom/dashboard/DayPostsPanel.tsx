"use client";

import { PostCard } from "@/components/Custom/posts/PostCard";
import { Button } from "@/components/retroui/Button";
import { Empty } from "@/components/retroui/Empty";
import { useDeletePost } from "@/hooks/useDeletePost";
import { Post } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface DayPostsPanelProps {
  date: Date;
  posts: Post[];
  onClose: () => void;
}

export const DayPostsPanel = ({ date, posts, onClose }: DayPostsPanelProps) => {
  const router = useRouter();
  const { mutate: deletePost } = useDeletePost();

  return (
    <aside className="flex flex-col h-full w-80 xl:w-96 border-l-2 border-border bg-sidebar shrink-0">
      {/* Panel header */}
      <div className="flex items-start justify-between px-4 py-4 border-b-2 border-border shrink-0">
        <div>
          <p className="text-xs font-mono text-muted-foreground">
            {format(date, "EEEE")}
          </p>
          <h3 className="font-heading font-bold text-base mt-0.5">
            {format(date, "MMMM d, yyyy")}
          </h3>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""} scheduled
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
          <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
        </Button>
      </div>

      {/* Posts list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty>
              <Empty.Content>
                <Empty.Icon className="size-8" />
                <Empty.Title>No Posts</Empty.Title>
                <Empty.Separator />
                <Empty.Description>
                  Nothing scheduled for this day.
                </Empty.Description>
              </Empty.Content>
            </Empty>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              onEdit={() => router.push(`/posts/${post.id}/edit`)}
              onDelete={() => deletePost(post.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
};
