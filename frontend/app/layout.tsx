import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhriguSetu | Jyotisha Calculation & Research",
  description: "A research workspace for Jyotisha chart calculation, BCP and BSP method study, and a source-linked Granthalaya catalogue. Inspect calculation settings and research status.",
  applicationName: "BhriguSetu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
