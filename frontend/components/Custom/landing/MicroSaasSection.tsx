import { HugeiconsIcon } from "@hugeicons/react";
import { MoneyBag01Icon } from "@hugeicons/core-free-icons";
import { SectionLabel } from "./SectionLabel";
import { SAAS_STEPS } from "./landing.data";

const StepCard = ({ n, title, body, isLast }: { n: string; title: string; body: string; isLast: boolean }) => (
  <div className={`p-8 flex flex-col gap-4 bg-background ${!isLast ? "border-b-2 lg:border-b-0 lg:border-r-2 border-black" : ""}`}>
    <span className="font-mono text-5xl font-black text-border leading-none select-none">{n}</span>
    <div className="flex flex-col gap-2">
      <h3 className="font-heading font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  </div>
);

export const MicroSaasSection = () => (
  <section className="border-b-2 border-black bg-[repeating-linear-gradient(0deg,transparent,transparent_23px,oklch(0.922_0.005_34.3)_23px,oklch(0.922_0.005_34.3)_24px)]">
    <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col gap-12">

      <div className="flex flex-col items-center gap-4 text-center">
        <SectionLabel>Micro SaaS Blueprint</SectionLabel>
        <h2 className="font-heading text-3xl lg:text-4xl font-bold">Want to charge for it? You can.</h2>
        <p className="text-muted-foreground max-w-lg">
          The codebase is designed to be forked and commercialized.
          Three steps to a revenue-generating LinkedIn scheduling SaaS:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-black shadow-[6px_6px_0px_0px_#000]">
        {SAAS_STEPS.map(({ n, title, body }, i) => (
          <StepCard key={n} n={n} title={title} body={body} isLast={i === SAAS_STEPS.length - 1} />
        ))}
      </div>

      <div className="border-2 border-black bg-accent p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[4px_4px_0px_0px_#000]">
        <HugeiconsIcon icon={MoneyBag01Icon} size={32} strokeWidth={1.5} className="shrink-0" />
        <div>
          <p className="font-heading font-bold text-base">The economics work.</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Hosting on Railway/Render runs ~$5–10/month. Charge 20 users $5/month = $100/month profit with zero feature work.
            A lean micro SaaS that runs itself.
          </p>
        </div>
      </div>

    </div>
  </section>
);
