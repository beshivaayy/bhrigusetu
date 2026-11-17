import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BhriguSetu | Jyotish Software",
  description: "Vedic astrology chart calculations, divisional charts, planetary positions, dashas and strength calculations.",
  applicationName: "BhriguSetu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
