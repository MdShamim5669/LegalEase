import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LegalEase — Talk to a Verified Lawyer, From Anywhere",
  description:
    "Bangladesh's premier online legal consultation platform connecting clients with verified advocates for scheduled video, phone, and chamber consultations.",
  keywords: [
    "LegalEase",
    "Lawyer Bangladesh",
    "Legal Consultation Dhaka",
    "Verified Advocates Bangladesh",
    "Legal Advice Online",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
