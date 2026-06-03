"use client";

import { Content } from "@/components/Custom/posts/ContentInput";
import { ImagePicker } from "@/components/Custom/posts/ImagePicker";
import { SchedulePicker } from "@/components/Custom/posts/SchedulePicker";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { uploadImage } from "@/hooks/useUploadImage";
import { useCreatePost } from "@/hooks/useCreatePost";
import { CreatePostInput, createPostSchema } from "@/lib/validators/postSchema";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftBigIcon } from "@hugeicons/core-free-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export interface CreatePostData {
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

  const contentLength = watch("content")?.length ?? 0;
  const hasContent = !!watch("content")?.trim();
  const canDraft = hasContent && !isPending;
  const canSchedule = canDraft && !!scheduledAt;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
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

  return (
    <div className="h-full overflow-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* Page header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b-2 border-border shrink-0">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label="Back to dashboard"
            >
              <HugeiconsIcon
                icon={ArrowLeftBigIcon}
                size={16}
                strokeWidth={2}
              />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-heading font-bold leading-none">
              Create Post
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Write and optionally schedule your LinkedIn post.
            </p>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
          {/* Left — content editor */}
          <div className="flex-1 p-6 overflow-auto ">
            <Card className="w-full h-full ">
              <Card.Content className="p-6 h-full ">
                <Content
                  register={register}
                  errors={errors}
                  contentLength={contentLength}
                />
              </Card.Content>
            </Card>
          </div>

          {/* Right — images + schedule */}
          <div className="w-full lg:w-80 xl:w-96 border-t-2 lg:border-t-0 lg:border-l-2 border-border flex flex-col overflow-auto">
            <div className="flex flex-col gap-0 divide-y-2 divide-border">
              {/* Images section */}
              <div className="p-5">
                <ImagePicker
                  selectedFiles={selectedFiles}
                  onSelect={handleImageSelect}
                  onRemove={(index) =>
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                />
              </div>

              {/* Schedule section */}
              <div className="p-5">
                <SchedulePicker
                  scheduledAt={scheduledAt}
                  showCalendar={showCalendar}
                  onToggleCalendar={() => setShowCalendar((v) => !v)}
                  onSelectDate={(date) => {
                    setScheduledAt(date);
                    setShowCalendar(false);
                  }}
                  onClear={() => {
                    setScheduledAt(undefined);
                    setShowCalendar(false);
                  }}
                  onTimeChange={handleTimeChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t-2 border-border shrink-0 bg-background">
          <Link href="/dashboard">
            <Button variant="outline" type="button" size="sm">
              Cancel
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              type="submit"
              size="sm"
              disabled={!canDraft}
            >
              {isPending ? "Saving…" : "Save as Draft"}
            </Button>
            <Button type="submit" size="sm" disabled={!canSchedule}>
              {isPending ? "Scheduling…" : "Schedule Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
