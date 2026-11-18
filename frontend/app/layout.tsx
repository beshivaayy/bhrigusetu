import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhriguSetu | Jyotish Research & Calculation",
  description: "A research-first workspace for Bhrigu Chakra Paddhati, Bhrigu Saral Paddhati and transparent Jyotish calculations.",
  applicationName: "BhriguSetu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
