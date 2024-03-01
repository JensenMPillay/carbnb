import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Color, type Car } from "@prisma/client";
import type { Metadata } from "next";
import {
  ColorsMap,
  PaintCombinations,
  resultODModel,
} from "../@types/imaginstudio";

// primary Color (Map...)
export const PRIMARY_COLOR = "#4cc2ae";

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

// Convert Color HSL to Hex
export function hslToHex(hsl: string): string {
  let formattedHsl = hsl.replaceAll("%", "").split(" ");
  if (formattedHsl.length != 3) return "";
  let h = Number(formattedHsl[0]);
  let s = Number(formattedHsl[1]);
  let l = Number(formattedHsl[2]);
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Create SVG Icon for Clusterer
export const createSVGClustererIcon = (
  color: "#ff0000" | typeof PRIMARY_COLOR,
  count: number,
): SVGSVGElement => {
  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("fill", color);
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgIcon.setAttribute("viewBox", "0 0 240 240");
  svgIcon.setAttribute("width", "50");
  svgIcon.setAttribute("height", "50");
  svgIcon.setAttribute("transform", "translate(0 25)");

  // Création des cercles
  const circle1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle1.setAttribute("cx", "120");
  circle1.setAttribute("cy", "120");
  circle1.setAttribute("opacity", ".6");
  circle1.setAttribute("r", "70");

  const circle2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle2.setAttribute("cx", "120");
  circle2.setAttribute("cy", "120");
  circle2.setAttribute("opacity", ".3");
  circle2.setAttribute("r", "90");

  const circle3 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle3.setAttribute("cx", "120");
  circle3.setAttribute("cy", "120");
  circle3.setAttribute("opacity", ".2");
  circle3.setAttribute("r", "110");

  const circle4 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle4.setAttribute("cx", "120");
  circle4.setAttribute("cy", "120");
  circle4.setAttribute("opacity", ".1");
  circle4.setAttribute("r", "130");

  // Création du texte
  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  textElement.setAttribute("x", "50%");
  textElement.setAttribute("y", "50%");
  textElement.setAttribute("style", "fill:#fff");
  textElement.setAttribute("text-anchor", "middle");
  textElement.setAttribute("font-size", "50");
  textElement.setAttribute("dominant-baseline", "middle");
  textElement.setAttribute("font-family", "roboto,arial,sans-serif");
  textElement.textContent = count.toString();

  // Ajout des éléments créés à l'élément SVG
  svgIcon.appendChild(circle1);
  svgIcon.appendChild(circle2);
  svgIcon.appendChild(circle3);
  svgIcon.appendChild(circle4);
  svgIcon.appendChild(textElement);
  return svgIcon;
};

// Car Model Utils
function generateCarModelsSearchUrl({
  brand,
  year,
}: {
  brand: string;
  year: number;
}): string {
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
}): Promise<string[]> {
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
function generateCarPaintsUrl({ brand }: { brand: string }): URL {
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
}): Promise<string[]> {
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
  angle,
}: {
  car: Pick<Car, "brand" | "model" | "year" | "trueColor">;
  angle?: number;
}): URL["href"] {
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
  angle && url.searchParams.append("angle", `${angle}`);

  return url.href;
}

// File Image Utils
export async function getFileFromUrl(url: URL) {
  const response = await fetch(url);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append("file", blob, "temp.webp");
  return formData;
}
