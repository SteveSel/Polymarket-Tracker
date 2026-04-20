// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polymarket Whale Tracker",
  description: "Analítica de carteras de Polymarket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-10 py-4 flex justify-between items-center">
            <div className="text-xl font-black text-blue-900 tracking-tighter">
              🐳 POLY<span className="text-blue-600">TRACKER</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Carteras Individuales
              </Link>
              <Link href="/top-trades" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                Mercado de Ballenas
              </Link>
            </div>
          </div>
        </nav>

        {}
        {children}
      </body>
    </html>
  );
}