import { CreatePostInput } from "@/lib/validators/postSchema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<CreatePostInput>;
  errors: FieldErrors<CreatePostInput>;
  contentLength: number;
}

export const Content = ({ register, errors, contentLength }: Props) => {
  return (
    <div className="flex flex-col gap-2">
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
    </div>
  );
};
