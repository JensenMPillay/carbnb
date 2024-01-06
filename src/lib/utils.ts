import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  // Verify Client Side
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL)
    return `https://pdfai-jensenmpillay.vercel.app${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

// Basic Metadata Boilerplate
export function constructMetadata({
  title = "CarBnb",
  description = "AirBnb for Cars",
  image = "../../public/carbnb-bg.jpg",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@jensenmpillay",
    },
    icons,
    metadataBase: new URL(absoluteUrl("/")),
    ...(noIndex && {
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
    }),
  };
}
