"use client";

import { Loader } from "@/components/retroui/Loader";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Loader
          count={4} // Number of squares
          duration={0.8} // Animation duration in seconds
          delayStep={120} // Delay between squares in milliseconds
          className=""
        />
      </div>
    );
  }

  if (!user || isError) {
    redirect("/login");
  }

  return <>{children}</>;
};

export default ProtectedLayout;
