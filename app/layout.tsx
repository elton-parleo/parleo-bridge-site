import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expert Gear Reviews | YourSiteName",
  description: "Data-driven product reviews and price comparisons for the best gear.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900`}>
        {/* GLOBAL NAVBAR */}
        <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <ShoppingBag className="text-blue-600" />
                <span>Parleo<span className="text-blue-600">Reviews</span></span>
              </Link>
              
            </div>
          </div>
        </nav>

        <main className="min-h-screen">{children}</main>

        {/* GLOBAL FOOTER */}
        <footer className="bg-slate-50 border-t py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-500">
              © 2026 Parleo, Inc. As an affiliate, we may earn a commission from qualifying purchases.
            </p>
            <div className="flex justify-center gap-6 mt-4 text-sm font-medium text-slate-600">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}