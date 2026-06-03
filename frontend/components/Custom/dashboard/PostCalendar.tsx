"use client";

import { cn } from "@/lib/utils";
import { Post, PostStatus } from "@/types";
import { Button } from "@/components/retroui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftBigIcon, ArrowRightBigIcon } from "@hugeicons/core-free-icons";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useMemo, useState } from "react";

// Color coding per status — used for both dot indicators and event chips
const STATUS_DOT: Record<PostStatus, string> = {
  [PostStatus.DRAFT]: "bg-gray-400",
  [PostStatus.SCHEDULED]: "bg-blue-400",
  [PostStatus.PUBLISHED]: "bg-green-500",
  [PostStatus.FAILED]: "bg-red-400",
};

const STATUS_CHIP: Record<PostStatus, string> = {
  [PostStatus.DRAFT]: "bg-gray-100 text-gray-700 border-gray-300",
  [PostStatus.SCHEDULED]: "bg-blue-50 text-blue-700 border-blue-300",
  [PostStatus.PUBLISHED]: "bg-green-50 text-green-700 border-green-300",
  [PostStatus.FAILED]: "bg-red-50 text-red-700 border-red-300",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface PostCalendarProps {
  posts: Post[];
  selectedDate: Date | null;
  onDaySelect: (date: Date) => void;
}

export const PostCalendar = ({ posts, selectedDate, onDaySelect }: PostCalendarProps) => {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = getDay(monthStart);

  // Group posts by scheduled date (yyyy-MM-dd key) for O(1) lookup per cell
  const postsByDate = useMemo(() => {
    return posts.reduce<Record<string, Post[]>>((acc, post) => {
      if (!post.scheduledAt) return acc;
      const key = format(new Date(post.scheduledAt), "yyyy-MM-dd");
      if (!acc[key]) acc[key] = [];
      acc[key].push(post);
      return acc;
    }, {});
  }, [posts]);

  const scheduledThisMonth = useMemo(
    () => days.reduce((n, day) => n + (postsByDate[format(day, "yyyy-MM-dd")]?.length ?? 0), 0),
    [days, postsByDate]
  );

  const unscheduledCount = useMemo(
    () => posts.filter((p) => !p.scheduledAt).length,
    [posts]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header: month name + stats + navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-border shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-heading font-bold">
            {format(viewMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
              {scheduledThisMonth} scheduled
            </span>
            {unscheduledCount > 0 && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded border border-border">
                {unscheduledCount} drafts
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            aria-label="Previous month"
          >
            <HugeiconsIcon icon={ArrowLeftBigIcon} size={14} strokeWidth={2} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMonth(startOfMonth(new Date()))}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
          >
            <HugeiconsIcon icon={ArrowRightBigIcon} size={14} strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-auto p-4">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-mono font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid — outer border via border-l-2 border-t-2; cells carry border-r-2 border-b-2 */}
        <div className="grid grid-cols-7 border-l-2 border-t-2 border-border">
          {Array.from({ length: startOffset }, (_, i) => (
            <div
              key={`pad-${i}`}
              className="border-r-2 border-b-2 border-border min-h-28 bg-muted/20"
            />
          ))}

          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayPosts = postsByDate[key] ?? [];
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            const isDayToday = isToday(day);

            return (
              <DayCell
                key={key}
                day={day}
                posts={dayPosts}
                isSelected={isSelected}
                isToday={isDayToday}
                onClick={() => onDaySelect(day)}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-6 py-3 border-t-2 border-border shrink-0">
        <span className="text-xs font-mono text-muted-foreground">Legend:</span>
        {(Object.entries(STATUS_DOT) as [PostStatus, string][]).map(([status, dotCls]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-full shrink-0", dotCls)} />
            <span className="text-xs font-mono text-muted-foreground capitalize">
              {status.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DayCellProps {
  day: Date;
  posts: Post[];
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

const DayCell = ({ day, posts, isSelected, isToday, onClick }: DayCellProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
    className={cn(
      "border-r-2 border-b-2 border-border min-h-28 p-2 cursor-pointer transition-colors",
      "hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
      isSelected && "bg-primary/5 ring-2 ring-inset ring-primary",
      !isSelected && isToday && "bg-accent/20"
    )}
  >
    {/* Day number */}
    <div className="flex justify-end mb-1.5">
      <span
        className={cn(
          "size-6 flex items-center justify-center text-sm font-mono font-medium rounded-full",
          isToday
            ? "bg-primary text-primary-foreground"
            : "text-foreground"
        )}
      >
        {format(day, "d")}
      </span>
    </div>

    {/* Post event chips — show at most 2, then an overflow count */}
    <div className="flex flex-col gap-0.5">
      {posts.slice(0, 2).map((post) => (
        <div
          key={post.id}
          className={cn(
            "text-[10px] font-mono px-1.5 py-0.5 rounded border truncate leading-tight",
            STATUS_CHIP[post.status]
          )}
        >
          {post.content.slice(0, 22)}{post.content.length > 22 ? "…" : ""}
        </div>
      ))}
      {posts.length > 2 && (
        <span className="text-[10px] font-mono text-muted-foreground pl-1">
          +{posts.length - 2} more
        </span>
      )}
    </div>
  </div>
);
