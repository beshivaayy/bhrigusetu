import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhriguSetu | BCP & BSP Research Platform",
  description: "A source-traceable research platform for Bhrigu Chakra Paddhati and Bhrigu Saral Paddhati.",
  applicationName: "BhriguSetu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
