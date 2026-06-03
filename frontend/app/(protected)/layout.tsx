"use client";

import { Sidebar } from "@/components/Custom/dashboard/Sidebar";
import { Loader } from "@/components/retroui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader count={4} duration={0.8} delayStep={120} className="" />
      </div>
    );
  }

  if (!user || isError) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default ProtectedLayout;
