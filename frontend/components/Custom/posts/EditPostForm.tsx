"use client";

import { Content } from "./ContentInput";
import { SchedulePicker } from "./SchedulePicker";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { useEditPost } from "@/hooks/useEditPost";
import { uploadImage } from "@/hooks/useUploadImage";
import { CreatePostInput, createPostSchema } from "@/lib/validators/postSchema";
import { Post } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftBigIcon, ArrowRightBigIcon, Cancel01Icon, Upload01Icon, FullScreenIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface EditPostFormProps {
  post: Post;
}

export const EditPostForm = ({ post }: EditPostFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: post.content },
  });

  const router = useRouter();
  const { isPending, mutate: savePost } = useEditPost();

  const [existingUrls, setExistingUrls] = useState<string[]>(post.imageUrls);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(
    post.scheduledAt ? new Date(post.scheduledAt) : undefined
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const contentLength = watch("content")?.length ?? 0;
  const hasContent = !!watch("content")?.trim();
  const canSave = hasContent && !isPending;
  const canSchedule = canSave && !!scheduledAt;

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!scheduledAt) return;
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const updated = new Date(scheduledAt);
    updated.setHours(hours, minutes, 0, 0);
    setScheduledAt(updated);
  };

  const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
    const uploadedUrls = await Promise.all(newFiles.map(uploadImage));
    const imageUrls = [...existingUrls, ...uploadedUrls];
    const payload = buildPayload(data, imageUrls);
    if (Object.keys(payload).length === 0) return;
    savePost(
      { data: payload, id: post.id },
      { onSuccess: () => router.replace("/dashboard") }
    );
  };

  // Only send fields that actually changed — avoids unnecessary API writes
  const buildPayload = (data: { content: string }, imageUrls: string[]) => {
    const payload: { content?: string; imageUrls?: string[]; scheduledAt?: string } = {};

    if (data.content !== post.content) payload.content = data.content;

    const imageChanged =
      imageUrls.length !== post.imageUrls.length ||
      imageUrls.some((url, i) => url !== post.imageUrls[i]);
    if (imageChanged) payload.imageUrls = imageUrls;

    const next = scheduledAt?.toISOString() ?? null;
    const prev = post.scheduledAt ?? null;
    if (next !== prev) payload.scheduledAt = next ?? undefined;

    return payload;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-screen flex flex-col overflow-hidden">

        {/* Page header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b-2 border-border shrink-0">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" type="button" aria-label="Back to dashboard">
              <HugeiconsIcon icon={ArrowLeftBigIcon} size={16} strokeWidth={2} />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-heading font-bold leading-none">Edit Post</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Make changes and save or reschedule.
            </p>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

          {/* Left — content editor */}
          <div className="flex-1 p-6 flex flex-col min-h-0">
            <Card className="w-full flex-1 min-h-0 flex flex-col">
              <Card.Content className="p-6 flex-1 min-h-0 flex flex-col">
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
              <ImageSection
                existingUrls={existingUrls}
                newFiles={newFiles}
                onRemoveExisting={(i) =>
                  setExistingUrls((prev) => prev.filter((_, idx) => idx !== i))
                }
                onAddFiles={(files) =>
                  setNewFiles((prev) => [...prev, ...files])
                }
                onRemoveNew={(i) =>
                  setNewFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
              />

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
            <Button variant="outline" type="submit" size="sm" disabled={!canSave}>
              {isPending ? "Saving…" : "Save as Draft"}
            </Button>
            <Button type="submit" size="sm" disabled={!canSchedule}>
              {isPending ? "Scheduling…" : "Schedule Post"}
            </Button>
          </div>
        </div>

      </form>
  );
};

// ─── ImageSection ────────────────────────────────────────────────────────────

const MAX_IMAGES = 20;

interface ImageSectionProps {
  existingUrls: string[];
  newFiles: File[];
  onRemoveExisting: (index: number) => void;
  onAddFiles: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
}

const ImageSection = ({
  existingUrls,
  newFiles,
  onRemoveExisting,
  onAddFiles,
  onRemoveNew,
}: ImageSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const newFileUrls = useMemo(
    () => newFiles.map((f) => URL.createObjectURL(f)),
    [newFiles]
  );

  // Flat list: existing URLs first, then new file object-URLs
  const allImages: { src: string; isNew: boolean }[] = [
    ...existingUrls.map((src) => ({ src, isNew: false })),
    ...newFileUrls.map((src) => ({ src, isNew: true })),
  ];

  const total = allImages.length;
  const isAtLimit = total >= MAX_IMAGES;

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null));
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % total : null));

  const handleRemove = (globalIndex: number) => {
    if (lightboxIndex === globalIndex) closeLightbox();
    if (globalIndex < existingUrls.length) {
      onRemoveExisting(globalIndex);
    } else {
      onRemoveNew(globalIndex - existingUrls.length);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold font-heading">Images</span>
        <span className="text-xs font-mono text-muted-foreground">{total} / {MAX_IMAGES}</span>
      </div>

      {/* 2-column thumbnail grid */}
      {total > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {allImages.map(({ src, isNew }, i) => (
            <div
              key={src}
              className={cn(
                "relative aspect-square rounded border-2 overflow-hidden group cursor-pointer",
                isNew ? "border-blue-300" : "border-border"
              )}
              onClick={() => openLightbox(i)}
            >
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {/* Hover overlay with expand icon */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <HugeiconsIcon icon={FullScreenIcon} size={22} strokeWidth={2} className="text-white" />
              </div>
              {isNew && (
                <span className="absolute bottom-1 left-1 text-[9px] font-mono bg-blue-500 text-white px-1 rounded leading-tight pointer-events-none">
                  new
                </span>
              )}
              {/* Remove button — stops propagation so it doesn't open lightbox */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                className="absolute top-1 right-1 bg-background/90 backdrop-blur-sm rounded-full p-1 border border-border text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove image"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={10} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <button
        type="button"
        disabled={isAtLimit}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full border-2 border-dashed rounded py-5 flex flex-col items-center gap-1.5 transition-colors",
          isAtLimit
            ? "opacity-50 cursor-not-allowed border-border"
            : "cursor-pointer border-border hover:border-primary hover:bg-accent/30"
        )}
      >
        <HugeiconsIcon icon={Upload01Icon} size={20} strokeWidth={1.5} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">
          {isAtLimit ? "Maximum images reached" : "Click to add images"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={isAtLimit}
        className="hidden"
        onChange={(e) => { onAddFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }}
      />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-mono text-sm bg-black/50 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {total}
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
            aria-label="Close"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>

          {/* Prev */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/80 transition-colors"
              aria-label="Previous image"
            >
              <HugeiconsIcon icon={ArrowLeftBigIcon} size={20} strokeWidth={2} />
            </button>
          )}

          {/* Image */}
          <img
            src={allImages[lightboxIndex].src}
            alt={`Image ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/80 transition-colors"
              aria-label="Next image"
            >
              <HugeiconsIcon icon={ArrowRightBigIcon} size={20} strokeWidth={2} />
            </button>
          )}

          {/* Remove from lightbox */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRemove(lightboxIndex); }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-destructive/80 hover:bg-destructive rounded px-4 py-2 text-sm font-medium transition-colors"
          >
            Remove image
          </button>
        </div>
      )}
    </div>
  );
};
