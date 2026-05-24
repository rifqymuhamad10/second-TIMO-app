import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "TIMO Web V2",
  description: "TIMO Web Application Version 2.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme="light"
    >
      <body className="min-h-full flex flex-col bg-base-100 text-base-content font-sans">
        {/* Navigation Bar */}
        <header className="navbar bg-base-200 shadow-sm px-4 md:px-8">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl font-bold tracking-wider text-primary">TIMO Web V2</a>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1 gap-2 font-medium">
              <li><a className="active">Beranda</a></li>
              <li><a>Tentang</a></li>
              <li><a>Layanan</a></li>
            </ul>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300">
          <aside>
            <p className="font-semibold">TIMO Web V2 &copy; {new Date().getFullYear()} - All rights reserved.</p>
            <p className="text-xs opacity-60">Built with Next.js, TailwindCSS, DaisyUI, and Supabase via Bun</p>
          </aside>
        </footer>
      </body>
    </html>
  );
}
