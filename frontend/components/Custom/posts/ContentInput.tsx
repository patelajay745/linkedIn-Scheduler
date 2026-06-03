import { cn } from "@/lib/utils";
import { CreatePostInput } from "@/lib/validators/postSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<CreatePostInput>;
  errors: FieldErrors<CreatePostInput>;
  contentLength: number;
}

const MAX_LENGTH = 3000;

const charCountColor = (length: number) => {
  const ratio = length / MAX_LENGTH;
  if (ratio >= 0.9) return "bg-red-500";
  if (ratio >= 0.7) return "bg-amber-400";
  return "bg-primary";
};

export const Content = ({ register, errors, contentLength }: Props) => {
  const ratio = Math.min(contentLength / MAX_LENGTH, 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold font-heading">
          Content <span className="text-destructive">*</span>
        </label>
        <span className={cn(
          "text-xs font-mono tabular-nums",
          contentLength / MAX_LENGTH >= 0.9 ? "text-red-500" : "text-muted-foreground"
        )}>
          {contentLength} / {MAX_LENGTH}
        </span>
      </div>

      <textarea
        {...register("content")}
        placeholder="What do you want to share with your network?"
        rows={12}
        maxLength={MAX_LENGTH}
        className="w-full rounded border-2 px-4 py-3 text-sm shadow-md resize-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary bg-background leading-relaxed"
      />

      {/* Character count progress bar */}
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-200", charCountColor(contentLength))}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>

      {errors.content && (
        <span className="text-xs text-destructive">{errors.content.message}</span>
      )}
    </div>
  );
};
