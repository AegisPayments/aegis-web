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
  title: "AegisPay - Decentralized Settlement Layer for Web3 Commerce",
  description:
    "The off-chain intelligence powering Web3's Visa-style Auth & Capture payment protocol. Bringing institutional-grade smart contracts to the machine economy.",
  keywords: [
    "DeFi",
    "Web3",
    "Payments",
    "Smart Contracts",
    "Chainlink",
    "AI",
    "Risk Engine",
  ],
  authors: [{ name: "Akal" }],
  openGraph: {
    title: "AegisPay - Decentralized Settlement Layer",
    description:
      "Bringing Visa-style 'Auth & Capture' to smart contracts with AI-powered risk assessment.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen aegis-gradient-bg`}
      >
        {children}
      </body>
    </html>
  );
}
