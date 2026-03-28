import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import CommandK from "@/components/ui/CommandK";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueFans Manager - AI-Powered Artist Management",
  description:
    "The No.1 AI-powered Artist Manager. Boost your music career with tailored release plans, promotional content, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ToastProvider>
          {children}
          <CommandK />
        </ToastProvider>
      </body>
    </html>
  );
}
