import { HugeiconsIcon } from "@hugeicons/react";
import { SectionLabel } from "./SectionLabel";
import { WHY_FREE } from "./landing.data";

export const WhyFreeSection = () => (
  <section className="border-b-2 border-black bg-primary text-primary-foreground">
    <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col gap-12">

      <div className="flex flex-col items-center gap-4 text-center">
        <SectionLabel inverted>Why Free</SectionLabel>
        <h2 className="font-heading text-3xl lg:text-4xl font-bold">
          Because scheduling your own content<br className="hidden lg:block" /> shouldn't cost $40/month
        </h2>
        <p className="text-primary-foreground/70 max-w-lg">
          The existing tools are overpriced, over-featured, and over-permissioned.
          This is the lean alternative you self-host in 10 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {WHY_FREE.map(({ icon, heading, body }) => (
          <div
            key={heading}
            className="border-2 border-primary-foreground p-5 flex gap-4 hover:bg-primary-foreground/5 transition-colors"
          >
            <div className="size-10 border-2 border-primary-foreground flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading font-bold text-base">{heading}</h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);
