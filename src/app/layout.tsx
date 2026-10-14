import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Playfair_Display, Cinzel } from "next/font/google";
import "./globals.css";
import { ClientRootShell } from "@/components/layout/ClientRootShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RouteBloom — Explore More. Plan Less. Travel Smarter.",
  description:
    "RouteBloom is an intelligent AI travel planning platform that builds personalized day-by-day itineraries with verified places, interactive route maps, and smart budget planning.",
  icons: {
    icon: "/routebloom-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jakarta.variable} ${playfair.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-heading min-h-screen flex flex-col">
        <ClientRootShell>{children}</ClientRootShell>
      </body>
    </html>
  );
}
