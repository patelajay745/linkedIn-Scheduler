import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Linkedin01Icon } from "@hugeicons/core-free-icons";

export const LandingFooter = () => (
  <footer className="bg-background">
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-heading text-base font-bold">Linked Schedular</span>
      <p className="text-xs font-mono text-muted-foreground text-center">
        Free, open source, self-hosted LinkedIn scheduler. No subscriptions.
      </p>
      <div className="flex items-center gap-4 text-muted-foreground">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="GitHub">
          <HugeiconsIcon icon={Github01Icon} size={18} strokeWidth={2} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
          <HugeiconsIcon icon={Linkedin01Icon} size={18} strokeWidth={2} />
        </a>
      </div>
    </div>
  </footer>
);
