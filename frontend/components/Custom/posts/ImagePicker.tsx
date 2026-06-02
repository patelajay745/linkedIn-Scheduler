import { ImageIcon, X } from "lucide-react";

export const ImagePicker = ({
  selectedFiles,
  onSelect,
  onRemove,
}: {
  selectedFiles: File[];
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold font-head">
        Images{" "}
        <span className="text-muted-foreground font-normal">
          (optional, max 20)
        </span>
      </label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onSelect}
        disabled={selectedFiles.length >= 20}
        className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-2 file:text-xs file:font-semibold file:cursor-pointer cursor-pointer"
      />

      {selectedFiles.length > 0 && (
        <ul className="flex flex-col gap-1.5 mt-1">
          {selectedFiles.map((file, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-xs font-mono bg-muted px-3 py-2 rounded border-2"
            >
              <ImageIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
