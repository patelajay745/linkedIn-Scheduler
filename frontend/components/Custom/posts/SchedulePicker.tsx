import { Button } from "@/components/retroui/Button";
import { Calendar } from "@/components/retroui/Calendar";
import { Card } from "@/components/retroui/Card";
import { CalendarIcon, X } from "lucide-react";

export const SchedulePicker = ({
  scheduledAt,
  showCalendar,
  onToggleCalendar,
  onSelectDate,
  onClear,
  onTimeChange,
}: {
  scheduledAt: Date | undefined;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onSelectDate: (date: Date | undefined) => void;
  onClear: () => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const timeValue = scheduledAt
    ? `${String(scheduledAt.getHours()).padStart(2, "0")}:${String(scheduledAt.getMinutes()).padStart(2, "0")}`
    : "";

  return (
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
        onClick={onToggleCalendar}
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
          type="button"
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 w-fit transition-colors"
        >
          <X className="size-3" /> Clear schedule
        </button>
      )}

      {scheduledAt && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-semibold">
            Pick a time
          </label>
          <input
            type="time"
            value={timeValue}
            onChange={onTimeChange}
            className="w-full rounded border-2 px-4 py-2 text-sm bg-background"
          />
        </div>
      )}

      {showCalendar && (
        <Card className="w-full">
          <Card.Content className="p-3">
            <Calendar
              mode="single"
              selected={scheduledAt}
              onSelect={onSelectDate}
              disabled={{ before: new Date() }}
            />
          </Card.Content>
        </Card>
      )}
    </div>
  );
};
