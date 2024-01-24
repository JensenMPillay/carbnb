import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Color, type Car } from "@prisma/client";
import type { Metadata } from "next";
import { ColorsMap, PaintCombinations, resultODModel } from "./types";

// Classname Util
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// URL Settings DEV/PROD
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

export async function getFileFromUrl(url: URL["href"]) {
  const response = await fetch(url);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append("file", blob, "temp.webp");
  return formData;
}

// Car Model Utils
function generateCarModelsSearchUrl({
  brand,
  year,
}: {
  brand: string;
  year: number;
}) {
  const baseUrl = new URL(
    "https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model@public/records",
  );

  // Format ODSQL
  baseUrl.searchParams.append("select", "basemodel");
  baseUrl.searchParams.append("group_by", "basemodel");
  const query = `make%20LIKE%20"${brand}"%20AND%20YEAR(year)=${year}`;

  const url = `${baseUrl}&where=${query}`;

  return url;
}

export async function getCarModels({
  brand,
  year,
}: {
  brand: string;
  year: number;
}) {
  const url = generateCarModelsSearchUrl({ brand: brand, year: year });
  const response = await fetch(url);
  const json = await response.json();
  const results = await json.results;
  const carModels: string[] = results.map(
    (result: resultODModel) => result.basemodel,
  );
  return carModels;
}

// Car Paint Utils
function generateCarPaintsUrl({ brand }: { brand: string }) {
  const url = new URL("https://cdn.imagin.studio/getPaints");

  url.searchParams.append(
    "customer",
    process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "",
  );
  url.searchParams.append("target", "make");
  url.searchParams.append("make", brand);

  return url;
}

export async function getCarPaintCombinations({ url }: { url: URL }) {
  const response = await fetch(url);
  const json = await response.json();
  const paintCombinations = json.paintData.paintCombinations;

  return paintCombinations;
}

export function extractCarColorsMap({
  paintCombinations,
}: {
  paintCombinations: PaintCombinations;
}) {
  // Initialization of colorsMap
  const colorsMap: ColorsMap = {};
  Object.values(Color).forEach(
    (value) => (colorsMap[value.toLowerCase()] = []),
  );

  // Iterate over paintCombinations => paintCombination
  Object.values(paintCombinations).forEach((paintCombination) => {
    const { paintSwatch, mapped } = paintCombination;

    if (!paintSwatch?.primary?.colourCluster || !mapped) return;

    // Iterate over paintCombination => mapped
    Object.values(mapped).forEach((value) => {
      if (!value.paintDescription) return;

      let { paintDescription } = value;
      const colourCluster = paintSwatch.primary.colourCluster;

      // Verification : "gray" => "grey"
      if (paintDescription.includes("gray")) {
        paintDescription = paintDescription.replace("gray", "grey");
      }

      // Verification : paintDescription in colorsMap[colourCluster]
      if (
        !colorsMap[colourCluster] ||
        !colorsMap[colourCluster].includes(paintDescription)
      ) {
        // Create colourCluster key if needed & Complete [...]
        colorsMap[colourCluster] = [
          ...(colorsMap[colourCluster] || []),
          paintDescription,
        ];
      }
    });
  });

  return colorsMap;
}

export async function getCarTrueColors({
  brand,
  primaryColor,
}: {
  brand: string;
  primaryColor: string;
}) {
  const url: URL = generateCarPaintsUrl({ brand: brand });
  const paintCombinations: PaintCombinations = await getCarPaintCombinations({
    url: url,
  });
  const colorsMap: ColorsMap = extractCarColorsMap({ paintCombinations });
  const trueColors: string[] = colorsMap[primaryColor.toLowerCase()];

  return trueColors;
}

// Car Image Utils
export function generateCarImageUrl({
  car: { brand, model, year, trueColor = "black" },
  angle = 0,
}: {
  car: Pick<Car, "brand" | "model" | "year" | "trueColor">;
  angle?: number;
}) {
  const url = new URL("https://cdn.imagin.studio/getimage");

  url.searchParams.append(
    "customer",
    process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "",
  );
  url.searchParams.append("make", brand);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("modelRange", model.split(" ")[1]);
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("paintDescription", trueColor);
  // url.searchParams.append("transmission", transmission);
  url.searchParams.append("countryCode", "FR");
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("angle", `${angle}`);

  return url.href;
}
