import { Button } from "@/components/retroui/Button";
import { Calendar } from "@/components/retroui/Calendar";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Time01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";

interface SchedulePickerProps {
  scheduledAt: Date | undefined;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  onSelectDate: (date: Date | undefined) => void;
  onClear: () => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SchedulePicker = ({
  scheduledAt,
  showCalendar,
  onToggleCalendar,
  onSelectDate,
  onClear,
  onTimeChange,
}: SchedulePickerProps) => {
  const timeValue = scheduledAt
    ? `${String(scheduledAt.getHours()).padStart(2, "0")}:${String(scheduledAt.getMinutes()).padStart(2, "0")}`
    : "";

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold font-heading">Schedule</label>

      {/* Selected date display or pick button */}
      {scheduledAt ? (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded border-2 bg-blue-50 border-blue-200">
          <HugeiconsIcon icon={Calendar03Icon} size={15} strokeWidth={1.5} className="text-blue-500 shrink-0" />
          <span className="text-sm font-mono flex-1 text-blue-700">
            {format(scheduledAt, "MMM d, yyyy")} at {timeValue || "—"}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-blue-400 hover:text-destructive transition-colors shrink-0"
            aria-label="Clear schedule"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
          </button>
        </div>
      ) : (
        <Button
          variant="outline"
          type="button"
          onClick={onToggleCalendar}
          className="w-full justify-start gap-2.5 font-normal text-muted-foreground"
        >
          <HugeiconsIcon icon={Calendar03Icon} size={15} strokeWidth={1.5} />
          Pick a date and time
        </Button>
      )}

      {/* Time input — shown only when a date is selected */}
      {scheduledAt && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <HugeiconsIcon icon={Time01Icon} size={13} strokeWidth={1.5} />
            Time
          </label>
          <input
            type="time"
            value={timeValue}
            onChange={onTimeChange}
            className="w-full rounded border-2 px-3 py-2 text-sm bg-background focus-visible:outline-2 focus-visible:outline-primary"
          />
        </div>
      )}

      {/* Toggle calendar button when date already selected */}
      {scheduledAt && (
        <button
          type="button"
          onClick={onToggleCalendar}
          className="text-xs text-muted-foreground hover:text-foreground font-mono transition-colors w-fit underline underline-offset-2"
        >
          {showCalendar ? "Hide calendar" : "Change date"}
        </button>
      )}

      {/* Inline calendar */}
      {showCalendar && (
        <div className={cn("rounded border-2 border-border overflow-hidden shadow-md")}>
          <Calendar
            mode="single"
            selected={scheduledAt}
            onSelect={(date) => {
              onSelectDate(date);
            }}
            disabled={{ before: new Date() }}
          />
        </div>
      )}
    </div>
  );
};
