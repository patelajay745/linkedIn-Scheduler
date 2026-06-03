"use client";
import { CreatePostInput, createPostSchema } from "@/lib/validators/postSchema";
import { Post } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Content } from "./ContentInput";
import { useState } from "react";
import { uploadImage } from "@/hooks/useUploadImage";
import { X } from "lucide-react";
import { ImagePicker } from "./ImagePicker";
import { SchedulePicker } from "./SchedulePicker";
import { Button } from "@/components/retroui/Button";
import { useEditPost } from "@/hooks/useEditPost";
import { useRouter } from "next/navigation";

export const EditPostForm = ({ post }: { post: Post }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: post.content,
    },
  });
  const router = useRouter();

  const { isPending, mutate: savePost } = useEditPost();

  const [existingUrls, setExistingUrls] = useState<string[]>(post.imageUrls);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(
    post.scheduledAt ? new Date(post.scheduledAt) : undefined,
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!scheduledAt) return;
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const updated = new Date(scheduledAt!);
    updated.setHours(hours, minutes, 0, 0);
    setScheduledAt(updated);
  };

  const content = watch("content");
  const contentLength = content?.length ?? 0;
  const canSubmit = !!content?.trim() && !isPending;

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    const uploadedUrls = await Promise.all(newFiles.map(uploadImage));

    const imageUrls = [...existingUrls, ...uploadedUrls];

    const payload = buildPayload(data, imageUrls);

    if (Object.keys(payload).length === 0) return;

    savePost(
      { data: payload, id: post.id },
      { onSuccess: () => router.replace("/dashboard") },
    );
  };

  const buildPayload = (
    data: {
      content: string;
    },
    imageUrls: string[],
  ) => {
    const payload: {
      content?: string;
      imageUrls?: string[];
      scheduledAt?: string;
    } = {};

    if (data.content !== post.content) payload.content = data.content;
    const imageChanged =
      imageUrls.length !== post.imageUrls.length ||
      imageUrls.some((url, i) => url !== post.imageUrls[i]);

    if (imageChanged) payload.imageUrls = imageUrls;

    const newScheduledAt = scheduledAt?.toISOString() ?? null;
    const oldScheduledAt = post.scheduledAt ?? null;

    if (newScheduledAt !== oldScheduledAt)
      payload.scheduledAt = newScheduledAt ?? undefined;

    return payload;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Content
        register={register}
        errors={errors}
        contentLength={contentLength}
      />

      {existingUrls.length > 0 && (
        <ul className="flex flex-col gap-1.5 mt-2">
          {existingUrls.map((url, i) => (
            <li key={url} className="relative w-24 h-24">
              <img
                src={url}
                alt="existing image"
                className="w-full h-full object-cover rounded border-2"
              />
              <button
                type="button"
                onClick={() =>
                  setExistingUrls((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="absolute top-1 right-1 bg-background rounded-full p-0.5 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ImagePicker
        selectedFiles={newFiles}
        onSelect={(e) =>
          setNewFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])
        }
        onRemove={(i) =>
          setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
        }
      />

      <SchedulePicker
        scheduledAt={scheduledAt}
        showCalendar={showCalendar}
        onTimeChange={handleTimeChange}
        onToggleCalendar={() => setShowCalendar((v) => !v)}
        onSelectDate={(date) => {
          setScheduledAt(date);
          setShowCalendar(false);
        }}
        onClear={() => setScheduledAt(undefined)}
      />

      <div className="flex gap-3 justify-end">
        <Button variant="outline" type="submit" disabled={!canSubmit}>
          {isPending ? "Saving..." : "Save as Draft"}
        </Button>
        <Button type="submit" disabled={!canSubmit || !scheduledAt}>
          {isPending ? "Scheduling..." : "Schedule Post"}
        </Button>
      </div>
    </form>
  );
};
