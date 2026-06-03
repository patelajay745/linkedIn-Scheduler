import { Card } from "@/components/retroui/Card";
import { HugeiconsIcon } from "@hugeicons/react";
import { SectionLabel } from "./SectionLabel";
import { FEATURES } from "./landing.data";

export const FeaturesSection = () => (
  <section className="border-b-2 border-black">
    <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col gap-12">

      <div className="flex flex-col items-center gap-4 text-center">
        <SectionLabel>What it does</SectionLabel>
        <h2 className="font-heading text-3xl lg:text-4xl font-bold">
          Everything you need, nothing you don't
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Built lean — a scheduler, a calendar, and a post editor. No analytics, no AI fluff, no upsell pop-ups.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map(({ icon, title, description }) => (
          <Card
            key={title}
            className="flex flex-col border-2 border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all p-5 gap-4 w-full"
          >
            <div className="size-10 border-2 border-black bg-primary text-primary-foreground flex items-center justify-center shadow-[3px_3px_0px_0px_#000] shrink-0">
              <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-heading font-bold text-base">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </Card>
        ))}
      </div>

    </div>
  </section>
);
