import { cn, constructMetadata } from "@/src/lib/utils";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { Raleway } from "next/font/google";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Toaster } from "../components/ui/sonner";
import { ApolloProvider } from "../providers/apollo-wrapper";
import "./globals.css";

import type { Metadata } from "next";
import type { NextFontWithVariable } from "next/dist/compiled/@next/font";

const raleway: NextFontWithVariable = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

/**
 * Constructs metadata for the RootLayout component.
 */
export const metadata: Metadata = constructMetadata();

// export const dynamic = "force-dynamic";

// export const revalidate = 0;

/**
 * RootLayout component serves as the root layout for the application.
 * @param {React.ReactNode} children The child components to be rendered within the layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen w-full antialiased", raleway.className)}
      >
        <ApolloProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="bg-gradient min-h-screen w-full">
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </div>
          </ThemeProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
