"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SectionLabel } from "./SectionLabel";
import { FadeUp } from "./FadeUp";
import { USE_CASES } from "./landing.data";
import { fadeUp, stagger } from "./animations";

export const UseCasesSection = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px 0px" });

  return (
    <section className="border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col gap-12">

        <FadeUp className="flex flex-col items-center gap-4 text-center">
          <SectionLabel>Use Cases</SectionLabel>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold">Who is this for?</h2>
        </FadeUp>

        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {USE_CASES.map(({ icon, who, what }) => (
            <motion.div
              key={who}
              variants={fadeUp}
              className="flex items-start gap-5 border-2 border-black p-6 bg-background shadow-[4px_4px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              <div className="size-11 border-2 border-black bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_#000]">
                <HugeiconsIcon icon={icon} size={20} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading font-bold text-base">{who}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{what}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
