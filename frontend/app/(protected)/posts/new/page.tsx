"use client";

import { Button } from "@/components/retroui/Button";
import { Calendar } from "@/components/retroui/Calendar";
import { Card } from "@/components/retroui/Card";
import { CalendarIcon, ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostInput, createPostSchema } from "@/lib/validators/postSchema";
import { uploadImage } from "@/hooks/useUploadImage";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useRouter } from "next/navigation";
import { ImagePicker } from "@/components/Custom/posts/ImagePicker";
import { SchedulePicker } from "@/components/Custom/posts/SchedulePicker";
import { Content } from "@/components/Custom/posts/ContentInput";

export interface createPostData {
  content: string;
  imageUrls: string[];
  scheduledAt?: string;
}

const CreatePostPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostInput>({ resolver: zodResolver(createPostSchema) });

  const { mutate: createPost, isPending } = useCreatePost();
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const updated = new Date(scheduledAt!);
    updated.setHours(hours, minutes, 0, 0);
    setScheduledAt(updated);
  };

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    const imageUrls = await Promise.all(selectedFiles.map(uploadImage));
    createPost(
      {
        content: data.content,
        imageUrls,
        scheduledAt: scheduledAt?.toISOString(),
      },
      { onSuccess: () => router.push("/dashboard") },
    );
  };

  const contentLength = watch("content")?.length ?? 0;
  const canSubmit = !!watch("content")?.trim() && !isPending;

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold font-head">Create Post</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Write your LinkedIn post and optionally schedule it for later.
            </p>
          </div>

          <Card className="w-full">
            <Card.Content className="flex flex-col gap-6 p-6">
              {/* Content */}
              {/* <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold font-head">
                  Content <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register("content")}
                  placeholder="What do you want to share?"
                  rows={8}
                  maxLength={3000}
                  className="w-full rounded border-2 px-4 py-3 text-sm shadow-md resize-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus:shadow-xs bg-background"
                />
                <p className="text-xs text-muted-foreground text-right font-mono">
                  {contentLength} / 3000
                </p>
                {errors.content && (
                  <span className="text-xs text-destructive">
                    {errors.content.message}
                  </span>
                )}
              </div> */}

              <Content
                register={register}
                errors={errors}
                contentLength={contentLength}
              />

              {/* Images */}
              <ImagePicker
                selectedFiles={selectedFiles}
                onSelect={handleImageSelect}
                onRemove={handleRemoveFile}
              />

              {/* Schedule */}
              <SchedulePicker
                scheduledAt={scheduledAt}
                showCalendar={showCalendar}
                onToggleCalendar={() => setShowCalendar((v) => !v)}
                onSelectDate={(date) => {
                  setScheduledAt(date);
                  setShowCalendar(false);
                }}
                onClear={() => setScheduledAt(undefined)}
                onTimeChange={handleTimeChange}
              />
            </Card.Content>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" type="submit" disabled={!canSubmit}>
              {isPending ? "Saving..." : "Save as Draft"}
            </Button>
            <Button type="submit" disabled={!canSubmit || !scheduledAt}>
              {isPending ? "Scheduling..." : "Schedule Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
