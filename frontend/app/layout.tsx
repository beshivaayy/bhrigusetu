import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "BhriguSetu — BCP • BSP", description: "Research-first BCP and BSP platform" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
