import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClientRootShell } from "@/components/layout/ClientRootShell";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoamWise — Explore More. Plan Less. Travel Smarter.",
  description:
    "RoamWise is an intelligent AI travel planning platform that builds personalized day-by-day itineraries with verified places, interactive route maps, and smart budget planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-heading min-h-screen flex flex-col">
        <ClientRootShell>{children}</ClientRootShell>
      </body>
    </html>
  );
}
