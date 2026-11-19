import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhriguSetu | The Astrologer’s Workspace",
  description: "A professional Jyotisha workspace for chart calculation, Bhrigu Chakra Paddhati, Bhrigu Saral Paddhati, distinct astrology traditions and source-linked research.",
  applicationName: "BhriguSetu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
