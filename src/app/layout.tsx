import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Raleway as FontSans } from "next/font/google";
import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Car BnB",
  description: "AirBnB for Cars",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background font-raleway min-h-screen antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
