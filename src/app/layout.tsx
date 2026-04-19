import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Joblify | Find Your Next Big Opportunity",
  description: "Production-grade job portal with verified listings and daily updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900 min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
