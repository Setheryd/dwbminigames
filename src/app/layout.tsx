import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DWB Mini Games - DickWifButt Gaming Community",
  description: "A collection of mini-games themed around the DWB cryptocurrency. Play Flappy Bird, Kitty Cannon, and more with your favorite DickWifButt character!",
  keywords: "DWB, DickWifButt, mini-games, crypto games, blockchain gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
