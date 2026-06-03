"use client";

import { DayPostsPanel } from "@/components/Custom/dashboard/DayPostsPanel";
import { PostCalendar } from "@/components/Custom/dashboard/PostCalendar";
import { Error } from "@/components/Custom/Error";
import { Loader } from "@/components/retroui/Loader";
import { usePost } from "@/hooks/usePost";
import { Post } from "@/types";
import { isSameDay } from "date-fns";
import { useState, useMemo } from "react";

const DashboardPage = () => {
  const { data, isLoading, isError } = usePost();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Derive selected day's posts reactively so the panel auto-updates after mutations
  const selectedDayPosts = useMemo<Post[]>(() => {
    if (!selectedDate || !data?.posts) return [];
    return data.posts.filter(
      (post) => post.scheduledAt && isSameDay(new Date(post.scheduledAt), selectedDate)
    );
  }, [selectedDate, data?.posts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader count={4} duration={0.8} delayStep={120} className="" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Error />
      </div>
    );
  }

  const handleDaySelect = (date: Date) => {
    // Toggle: clicking the same day again closes the panel
    setSelectedDate((prev) => (prev && isSameDay(prev, date) ? null : date));
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <PostCalendar
          posts={data?.posts ?? []}
          selectedDate={selectedDate}
          onDaySelect={handleDaySelect}
        />
      </div>

      {selectedDate && (
        <DayPostsPanel
          date={selectedDate}
          posts={selectedDayPosts}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
