import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image02Icon, Cancel01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { useRef } from "react";

const MAX_IMAGES = 20;

interface ImagePickerProps {
  selectedFiles: File[];
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export const ImagePicker = ({ selectedFiles, onSelect, onRemove }: ImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isAtLimit = selectedFiles.length >= MAX_IMAGES;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold font-heading">Images</label>
        <span className="text-xs font-mono text-muted-foreground">
          {selectedFiles.length} / {MAX_IMAGES}
        </span>
      </div>

      {/* Upload zone */}
      <button
        type="button"
        disabled={isAtLimit}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "w-full border-2 border-dashed rounded py-6 flex flex-col items-center gap-2 transition-colors",
          isAtLimit
            ? "opacity-50 cursor-not-allowed border-border"
            : "cursor-pointer border-border hover:border-primary hover:bg-accent/30"
        )}
      >
        <HugeiconsIcon icon={Upload01Icon} size={22} strokeWidth={1.5} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground font-medium">
          {isAtLimit ? "Maximum images reached" : "Click to upload images"}
        </span>
        <span className="text-xs text-muted-foreground font-mono">PNG, JPG, GIF up to 10MB each</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onSelect}
        disabled={isAtLimit}
        className="hidden"
      />

      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-2.5 text-xs font-mono bg-muted/60 px-3 py-2 rounded border-2"
            >
              <HugeiconsIcon icon={Image02Icon} size={13} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
              <span className="truncate flex-1 text-foreground">{file.name}</span>
              <span className="text-muted-foreground shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                aria-label={`Remove ${file.name}`}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
