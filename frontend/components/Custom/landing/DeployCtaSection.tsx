"use client";

import Link from "next/link";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/retroui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon, RocketIcon, Github01Icon } from "@hugeicons/core-free-icons";
import { DEPLOY_COMMANDS } from "./landing.data";
import { slideLeft, slideRight } from "./animations";

export const DeployCtaSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className="border-b-2 border-black bg-primary text-primary-foreground">
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-8"
      >

        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col gap-4 max-w-xl"
        >
          <div className="flex items-center gap-3">
            <HugeiconsIcon icon={CloudUploadIcon} size={28} strokeWidth={1.5} />
            <h2 className="font-heading text-2xl lg:text-3xl font-bold">Deploy in 10 minutes</h2>
          </div>
          <p className="text-primary-foreground/70 leading-relaxed">
            Clone the repo, set three environment variables (LinkedIn Client ID, DB URL, session secret),
            and deploy. Works on Railway, Render, Fly.io, or a $5 VPS.
          </p>
          <div className="flex flex-col gap-2 font-mono text-sm">
            {DEPLOY_COMMANDS.map((cmd, i) => (
              <motion.div
                key={cmd}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 + i * 0.1 }}
                className="border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2 rounded"
              >
                <span className="text-primary-foreground/50 mr-2">$</span>{cmd}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={slideRight}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-5"
        >
          <Link href="/login">
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button size="lg" className="bg-primary-foreground text-primary border-primary-foreground hover:bg-primary-foreground/90 gap-2">
                <HugeiconsIcon icon={RocketIcon} size={18} strokeWidth={2} />
                Start Scheduling
              </Button>
            </motion.div>
          </Link>
          <motion.a
            href="https://github.com/patelajay745/linkedIn-Scheduler"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <HugeiconsIcon icon={Github01Icon} size={16} strokeWidth={2} />
            Star on GitHub
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};
