import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhriguSetu | Astrology, Jyotish & Divination",
  description: "Explore Jyotish, world astrology, Tarot, Numerology and traditional systems of divination and wisdom.",
  applicationName: "BhriguSetu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
