"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Add01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Calendar03Icon, label: "Calendar" },
  { href: "/posts/new", icon: Add01Icon, label: "New Post" },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="h-screen w-56 border-r-2 border-border bg-sidebar flex flex-col shrink-0">
      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b-2 border-border shrink-0">
        <span className="font-heading text-base font-bold leading-snug">
          Linked<br />Schedular
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)]"
                  : "text-sidebar-foreground border-2 border-transparent"
              )}
            >
              <HugeiconsIcon icon={icon} size={16} strokeWidth={2} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className="border-t-2 border-border p-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
