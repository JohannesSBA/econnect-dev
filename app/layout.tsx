import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./not-found";

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
    <html
      lang="en"
      className="scrollbar-thin scrollbar-webkit light bg-zinc-100"
    >
      <ErrorBoundary fallback={<ErrorPage />}>
        <Toaster position="top-center" richColors />
        <body className={inter.className}>{children}</body>
      </ErrorBoundary>
    </html>
  );
}
