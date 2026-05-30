"use client";

import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Post as PostType, PostStatus } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Calendar, ImageIcon, Pencil, Trash2 } from "lucide-react";

const statusStyles: Record<PostStatus, string> = {
  [PostStatus.DRAFT]: "bg-gray-100 text-gray-700 border-2 border-gray-400",
  [PostStatus.SCHEDULED]: "bg-blue-100 text-blue-700 border-2 border-blue-400",
  [PostStatus.PUBLISHED]: "bg-green-100 text-green-700 border-2 border-green-500",
  [PostStatus.FAILED]: "bg-red-100 text-red-700 border-2 border-red-400",
};

const isEditable = (status: PostStatus) =>
  status === PostStatus.DRAFT || status === PostStatus.SCHEDULED;

interface PostCardProps extends PostType {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PostCard = ({
  id,
  content,
  imageUrls,
  status,
  scheduledAt,
  createdAt,
  onEdit,
  onDelete,
}: PostCardProps) => {
  return (
    <Card className="w-full flex flex-col gap-0">
      <Card.Header className="flex flex-row items-center justify-between py-3 px-4 border-b-2">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded font-mono tracking-wider ${statusStyles[status]}`}
        >
          {status}
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      </Card.Header>

      <Card.Content className="flex flex-col gap-3 py-4 px-4">
        <p className="text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">
          {content}
        </p>

        <div className="flex flex-col gap-1.5">
          {scheduledAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Calendar className="size-3.5" />
              <span>
                Scheduled for{" "}
                {new Date(scheduledAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}

          {imageUrls.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <ImageIcon className="size-3.5" />
              <span>
                {imageUrls.length} image{imageUrls.length > 1 ? "s" : ""}{" "}
                attached
              </span>
            </div>
          )}
        </div>
      </Card.Content>

      {isEditable(status) && (
        <div className="flex justify-end gap-2 px-4 py-3 border-t-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(id)}
            className="flex items-center gap-1.5"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDelete?.(id)}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      )}
    </Card>
  );
};
