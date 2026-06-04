"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/retroui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Linkedin01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

const TRUST_ITEMS = ["No subscription", "Self-hosted", "Open source"];

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/linkedin`;
  };

  return (
    <div className="min-h-screen bg-[repeating-linear-gradient(135deg,transparent,transparent_14px,oklch(0.96_0.002_17.2)_14px,oklch(0.96_0.002_17.2)_15px)] flex flex-col items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="border-2 border-black bg-background shadow-[8px_8px_0px_0px_#000] flex flex-col">

          <div className="border-b-2 border-black bg-primary text-primary-foreground px-8 py-6 flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground/60">
              Linked Schedular
            </span>
            <h1 className="font-heading text-2xl font-bold">Welcome back.</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">
              Sign in with LinkedIn to access your scheduling dashboard.
            </p>
          </div>

          <div className="px-8 py-8 flex flex-col gap-6">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full gap-3"
              >
                <HugeiconsIcon icon={Linkedin01Icon} size={20} strokeWidth={2} />
                Continue with LinkedIn
              </Button>
            </motion.div>

            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground justify-center flex-wrap">
              {TRUST_ITEMS.map((item) => (
                <span key={item} className="flex items-center gap-1">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} strokeWidth={2.5} className="text-foreground" />
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
            Back to home
          </Link>
        </div>
      </motion.div>

    </div>
  );
};

export default LoginPage;
