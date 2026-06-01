"use client";

import { Button } from "@/components/retroui/Button";
import { Calendar } from "@/components/retroui/Calendar";
import { Card } from "@/components/retroui/Card";
import { Input } from "@/components/retroui/Input";
import { CalendarIcon, ImageIcon, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostInput, createPostSchema } from "@/lib/validators/postSchema";

export interface createPostData {
  content: string;
  imageUrls: string[];
  scheduledAt: string;
}

const CreatePostPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });
  const onSubmit: SubmitHandler<CreatePostInput> = (data) => console.log(data);

  const [isUploading, setIsUploading] = useState(false);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  const addImageUrl = () => {
    const trimmed = imageInput.trim();
    if (!trimmed || imageUrls.length >= 20) return;
    setImageUrls((prev) => [...prev, trimmed]);
    setImageInput("");
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    setIsUploading(true);
  };

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
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold font-head">
                  Content <span className="text-destructive">*</span>
                </label>
                <textarea
                  {...register("content", { required: true })}
                  placeholder="What do you want to share?"
                  rows={8}
                  maxLength={3000}
                  className="w-full rounded border-2 px-4 py-3 text-sm shadow-md resize-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus:shadow-xs bg-background"
                />
                <p className="text-xs text-muted-foreground text-right font-mono">
                  {watch("content")?.length} / 3000
                </p>

                {errors.content && <span>This field is required</span>}
              </div>

              {/* Image URLs */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold font-head">
                  Images
                  <span className="text-muted-foreground font-normal">
                    (optional, max 20)
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    max={4}
                    onChange={() => {}}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addImageUrl}
                    disabled={!imageInput.trim() || imageUrls.length >= 20}
                    type="button"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                {imageUrls.length > 0 && (
                  <ul className="flex flex-col gap-1.5 mt-1">
                    {imageUrls.map((url, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs font-mono bg-muted px-3 py-2 rounded border-2"
                      >
                        <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate flex-1">{url}</span>
                        <button
                          onClick={() => removeImageUrl(i)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <X className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Schedule */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold font-head">
                  Schedule{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional — leave empty to save as draft)
                  </span>
                </label>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowCalendar((v) => !v)}
                  className="w-full justify-start gap-2 font-normal"
                >
                  <CalendarIcon className="size-4" />
                  {scheduledAt
                    ? scheduledAt.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Pick a date and time"}
                </Button>

                {scheduledAt && (
                  <button
                    onClick={() => setScheduledAt(undefined)}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 w-fit transition-colors"
                  >
                    <X className="size-3" /> Clear schedule
                  </button>
                )}

                {showCalendar && (
                  <Card className="w-full">
                    <Card.Content className="p-3">
                      <Calendar
                        mode="single"
                        selected={scheduledAt}
                        onSelect={(date) => {
                          setScheduledAt(date);
                          setShowCalendar(false);
                        }}
                        disabled={{ before: new Date() }}
                      />
                    </Card.Content>
                  </Card>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              type="submit"
              disabled={!watch("content")?.trim()}
            >
              Save as Draft
            </Button>
            <Button disabled={!watch("content")?.trim() || !scheduledAt}>
              Schedule Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
