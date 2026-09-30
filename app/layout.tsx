import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiDi",
  description: "Khám phá các tỉnh thành Việt Nam trên bản đồ tương tác",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable)}
    >
      <body className="flex h-dvh flex-col overflow-hidden">{children}</body>
    </html>
  );
}
