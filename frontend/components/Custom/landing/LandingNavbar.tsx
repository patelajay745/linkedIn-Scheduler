"use client";

import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/hooks/useAuth";

export const LandingNavbar = () => {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-background">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <span className="font-heading text-lg font-bold leading-none cursor-pointer">
            Linked
            <br />
            Schedular
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <a
            href="https://github.com/patelajay745/linkedIn-Scheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={Github01Icon} size={16} strokeWidth={2} />
            GitHub
          </a>

          {!isLoading && user && (
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
