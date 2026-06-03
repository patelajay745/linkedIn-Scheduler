"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export const SmoothScroll = ({ children }: { children: ReactNode }) => (
  <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
    {children}
  </ReactLenis>
);
