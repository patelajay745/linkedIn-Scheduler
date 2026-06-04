import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "./providers";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Linked Schedular",
    template: "%s | Linked Schedular",
  },
  description:
    "Free, open-source, self-hosted LinkedIn post scheduler. Schedule posts with a visual calendar, manage drafts, and publish directly — no subscriptions.",
  keywords: [
    "LinkedIn scheduler",
    "LinkedIn post scheduler",
    "self-hosted",
    "open source",
    "social media scheduler",
  ],
  openGraph: {
    title: "Linked Schedular",
    description:
      "Free, open-source, self-hosted LinkedIn post scheduler. No subscriptions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Linked Schedular",
    description:
      "Free, open-source, self-hosted LinkedIn post scheduler. No subscriptions.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
