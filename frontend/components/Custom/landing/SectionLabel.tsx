interface SectionLabelProps {
  children: React.ReactNode;
  inverted?: boolean;
}

export const SectionLabel = ({ children, inverted = false }: SectionLabelProps) => (
  <span
    className={
      inverted
        ? "font-mono text-xs font-bold uppercase tracking-widest border-2 border-primary-foreground px-3 py-1 inline-block shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]"
        : "font-mono text-xs font-bold uppercase tracking-widest border-2 border-black px-3 py-1 inline-block bg-primary text-primary-foreground shadow-[3px_3px_0px_0px_#000]"
    }
  >
    {children}
  </span>
);
