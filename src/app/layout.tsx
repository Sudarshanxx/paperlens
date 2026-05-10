// src/app/layout.tsx
import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PaperLens AI — See Through Any Research Paper",
  description:
    "Paste, upload, or link a research paper. Get a visual explanation that makes it easy to understand.",
  openGraph: {
    title: "PaperLens AI",
    description: "Visual explanations for research papers, powered by AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="bg-[#080B14] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
