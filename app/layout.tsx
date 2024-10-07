import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Econnect",
  description: "Get a job with Us",
  icons: "water-drop.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar-thin scrollbar-webkit dark">
      <Toaster position="top-center" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
