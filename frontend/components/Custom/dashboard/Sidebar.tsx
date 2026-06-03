"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Add01Icon,
  CircleArrowLeft01Icon,
  CircleArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Calendar03Icon, label: "Calendar" },
  { href: "/posts/new", icon: Add01Icon, label: "New Post" },
] as const;

export const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setCollapsed(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <aside
      className={cn(
        "relative h-screen border-r-2 border-border bg-sidebar flex flex-col shrink-0 transition-all duration-200",
        collapsed ? "w-14" : "w-56",
      )}
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-3 border-b-2 border-border shrink-0 overflow-hidden">
        {!collapsed && (
          <span className="font-heading text-base font-bold leading-snug whitespace-nowrap">
            Linked
            <br />
            Schedular
          </span>
        )}
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
                  : "text-sidebar-foreground border-2 border-transparent",
                collapsed && "justify-center px-0",
              )}
            >
              <HugeiconsIcon
                icon={icon}
                size={16}
                strokeWidth={2}
                className="shrink-0"
              />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Toggle button — sits on the right border */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="absolute bottom-20 -translate-y-1/2 right-0 translate-x-1/2 z-10 bg-sidebar border-2 border-border rounded-full p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <HugeiconsIcon
          icon={collapsed ? CircleArrowRight01Icon : CircleArrowLeft01Icon}
          size={20}
          strokeWidth={2}
        />
      </button>

      {/* User Info */}
      {user && (
        <div className="border-t-2 border-border p-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate leading-none">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
