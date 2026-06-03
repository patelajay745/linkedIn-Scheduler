"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  RocketIcon,
  Github01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { TRUST_BADGES } from "./landing.data";
import { fadeUp } from "./animations";
import type { ReactNode } from "react";

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const Highlight = ({ children }: { children: ReactNode }) => (
  <span className="relative inline-block">
    <span className="relative z-10">{children}</span>
    <motion.span
      className="absolute bottom-1 left-0 h-3 bg-primary/20 z-0"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
    />
  </span>
);

export const HeroSection = () => (
  <section className="border-b-2 border-black bg-[repeating-linear-gradient(135deg,transparent,transparent_14px,oklch(0.96_0.002_17.2)_14px,oklch(0.96_0.002_17.2)_15px)]">
    <motion.div
      className="max-w-6xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center gap-8"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp}>
        <Badge
          variant="outline"
          size="sm"
          className="font-mono tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_#000]"
        >
          FREE &amp; OPEN SOURCE
        </Badge>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl"
      >
        Stop <Highlight>overpaying</Highlight> for complicated{" "}
        <Highlight>LinkedIn post</Highlight> tools.
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed"
      >
        Linked Schedular is a self-hosted LinkedIn post scheduler with a visual
        calendar, draft management, and direct API publishing — completely free
        to deploy and use.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="https://github.com/patelajay745/linkedIn-Scheduler"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button variant="outline" size="lg" className="gap-2">
              <HugeiconsIcon icon={Github01Icon} size={18} strokeWidth={2} />
              View on GitHub
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-muted-foreground pt-2"
      >
        {TRUST_BADGES.map((label) => (
          <span key={label} className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={13}
              strokeWidth={2.5}
              className="text-foreground"
            />
            {label}
          </span>
        ))}
      </motion.div>
    </motion.div>
  </section>
);
