import { cn, constructMetadata } from "@/src/lib/utils";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { Raleway } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";
import { ApolloWrapper } from "../providers/apollo-wrapper";
import "./globals.css";

import type { Metadata } from "next";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { SessionContextProvider } from "../context/SessionContext";

const inter: NextFontWithVariable = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

// export const dynamic = "force-dynamic";

// export const revalidate = 0;

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
            <SessionContextProvider>
              <div className="bg-gradient-animation bg-300 min-h-screen w-full">
                <Navbar />
                {children}
                <Footer />
                <Toaster />
              </div>
            </SessionContextProvider>
          </ThemeProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
