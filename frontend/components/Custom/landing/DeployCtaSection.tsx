import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudUploadIcon, RocketIcon, Github01Icon } from "@hugeicons/core-free-icons";
import { DEPLOY_COMMANDS } from "./landing.data";

export const DeployCtaSection = () => (
  <section className="border-b-2 border-black bg-primary text-primary-foreground">
    <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">

      <div className="flex flex-col gap-4 max-w-xl">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={CloudUploadIcon} size={28} strokeWidth={1.5} />
          <h2 className="font-heading text-2xl lg:text-3xl font-bold">Deploy in 10 minutes</h2>
        </div>
        <p className="text-primary-foreground/70 leading-relaxed">
          Clone the repo, set three environment variables (LinkedIn Client ID, DB URL, session secret),
          and deploy. Works on Railway, Render, Fly.io, or a $5 VPS.
        </p>
        <div className="flex flex-col gap-2 font-mono text-sm">
          {DEPLOY_COMMANDS.map((cmd) => (
            <div key={cmd} className="border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-2 rounded">
              <span className="text-primary-foreground/50 mr-2">$</span>{cmd}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        <Link href="/login">
          <Button size="lg" className="bg-primary-foreground text-primary border-primary-foreground hover:bg-primary-foreground/90 gap-2">
            <HugeiconsIcon icon={RocketIcon} size={18} strokeWidth={2} />
            Start Scheduling
          </Button>
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
        >
          <HugeiconsIcon icon={Github01Icon} size={16} strokeWidth={2} />
          Star on GitHub
        </a>
      </div>

    </div>
  </section>
);
