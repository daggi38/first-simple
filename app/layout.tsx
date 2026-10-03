import type { Metadata, Viewport } from "next";
import { Figtree, Newsreader } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], style: ["normal", "italic"] });

const title = "Selome, aka Star, will you go on a simple date with me?";
const description = "Episode 01 — The Pilot. I picked a few places based on our chats.";

export const metadata: Metadata = {
  title,
  description,
  // Telegram and WhatsApp build the link preview from these
  openGraph: { title, description, type: "website", siteName: title },
  twitter: { card: "summary", title, description },
  robots: { index: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12100d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
