






"use client";  // ✅ Make layout a Client Component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ Import Footer
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <Toaster />
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto px-6">{children}</main>
          <Footer /> {/* ✅ Footer stays at bottom of every page */}
        </SessionProvider>
      </body>
    </html>
  );
}

