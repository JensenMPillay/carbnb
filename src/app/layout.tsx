import { cn } from "@/src/lib/utils";
import { ThemeProvider } from "@/src/providers/theme-provider";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";
import { ApolloWrapper } from "../providers/apollo-wrapper";
import "./globals.css";

const inter = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "CarBnb",
  description: "AirBnb for Cars",
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen w-full antialiased", inter.className)}>
        <ApolloWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
