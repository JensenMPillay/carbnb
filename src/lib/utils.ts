import tailwindConfig from "@/tailwind.config";
import { Color, type Car } from "@prisma/client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import resolveConfig from "tailwindcss/resolveConfig";
import {
  ColorsMap,
  PaintCombinations,
  resultODModel,
} from "../@types/imaginstudio";

import type { ClassValue } from "clsx";
import type { Metadata } from "next";
import type { Config } from "tailwindcss";
import type { DefaultColors } from "tailwindcss/types/generated/colors";

/**
 * Extracts the colors from the Tailwind CSS configuration.
 * @return {object} Object containing color definitions.
 */
export const { colors } =
  // Reset colors theme type with extended colors
  resolveConfig(tailwindConfig).theme as unknown as Config["theme"] & {
    colors: DefaultColors & typeof tailwindConfig.theme.extend.colors;
  };

/**
 * Merges classnames using Tailwind CSS and clsx.
 * @param {...ClassValue} inputs - Classnames to merge.
 * @return {string} Merged classnames string.
 * @example
 * const classNames = cn("text-xl", "bg-blue-500", { "rounded": true });
 * // Output: "text-xl bg-blue-500 rounded"
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates an absolute URL based on the environment.
 * @param {string} path - Relative path.
 * @return {string} Absolute URL.
 * @example
 * const url = absoluteUrl("/home");
 * // Output: "http://localhost:3000/home" (in development)
 */
export function absoluteUrl(path: string): string {
  // Verify Client Side
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL)
    return `https://carbnb-jmpillay.vercel.app/${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

/**
 * Constructs metadata for web pages including Open Graph and Twitter card properties.
 * @param {Object} options - Options for metadata.
 * @param {string} [options.title="CarBnb"] - Title of the page.
 * @param {string} [options.description="AirBnb for Cars"] - Description of the page.
 * @param {string} [options.image="../../public/carbnb-bg.jpg"] - URL of the image.
 * @param {string} [options.icons="/favicon.ico"] - URL of the icon.
 * @param {boolean} [options.noIndex=false] - Indicates whether the page should be indexed by search engines.
 * @return {Metadata} Metadata object containing page information.
 * @example
 * const metadata = constructMetadata({
 *   title: "My Page",
 *   description: "This is my page",
 *   image: "https://example.com/image.jpg",
 *   icons: "https://example.com/favicon.ico",
 *   noIndex: true
 * });
 */
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

/**
 * Converts HSL color to hexadecimal format.
 * @param {string} hsl - HSL color string (e.g., "hsl(210, 50%, 75%)").
 * @return {string} Hexadecimal color string.
 * @example
 * const hexColor = hslToHex("hsl(210, 50%, 75%)");
 * // Output: "#80c0c0"
 */
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

/**
 * Creates an SVG icon for a clusterer.
 * @param {string} color - Color of the icon.
 * @param {number} count - Number displayed on the icon.
 * @return {SVGSVGElement} SVG element representing the icon.
 * @example
 * const svgIcon = createSVGClustererIcon("#ff0000", 5);
 * // Output: SVG element with circle elements and text
 */
export const createSVGClustererIcon = (
  color: string,
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

/**
 * Generates a URL for searching car models based on brand and year.
 * @param {Object} options - Options for generating car models search URL.
 * @param {string} options.brand - Brand of the car.
 * @param {number} options.year - Year of the car.
 * @return {string} Search URL.
 * @example
 * const searchUrl = generateCarModelsSearchUrl({ brand: "Toyota", year: 2022 });
 * // Output: "https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model@public/records?..."
 */
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

/**
 * Fetches car models based on brand and year.
 * @param {Object} options - Options for fetching car models.
 * @param {string} options.brand - Brand of the car.
 * @param {number} options.year - Year of the car.
 * @return {Promise<string[]>} Promise resolving to an array of car models.
 * @example
 * const models = await getCarModels({ brand: "Toyota", year: 2022 });
 * // Output: ["Camry", "Corolla", ...]
 */
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

/**
 * Generates a URL for fetching car paints based on the brand.
 * @param {Object} options - Options for generating car paints URL.
 * @param {string} options.brand - Brand of the car.
 * @return {URL} URL for fetching car paints.
 * @example
 * const carPaintsUrl = generateCarPaintsUrl({ brand: "Toyota" });
 * // Output: URL object for fetching car paints.
 */
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

/**
 * Retrieves paint combinations for a car brand.
 * @param {Object} options - Options for fetching paint combinations.
 * @param {URL} options.url - URL to fetch paint combinations from.
 * @return {Promise<PaintCombinations>} Promise resolving to paint combinations data.
 * @example
 * const combinations = await getCarPaintCombinations({ url: paintUrl });
 * // Output: Paint combinations data
 */
async function getCarPaintCombinations({
  url,
}: {
  url: URL;
}): Promise<PaintCombinations> {
  const response = await fetch(url);
  const json = await response.json();
  const paintCombinations = json.paintData.paintCombinations;

  return paintCombinations;
}

/**
 * Extracts color mappings from paint combinations data.
 * @param {Object} options - Options for extracting color mappings.
 * @param {PaintCombinations} options.paintCombinations - Paint combinations data.
 * @return {ColorsMap} Object containing color mappings.
 * @example
 * const colorsMap = extractCarColorsMap({ paintCombinations });
 * // Output: Object containing color mappings
 */
function extractCarColorsMap({
  paintCombinations,
}: {
  paintCombinations: PaintCombinations;
}): ColorsMap {
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

/**
 * Retrieves true colors for a car brand and primary color.
 * @param {Object} options - Options for fetching true colors.
 * @param {string} options.brand - Brand of the car.
 * @param {string} options.primaryColor - Primary color of the car.
 * @return {Promise<string[]>} Promise resolving to an array of true colors.
 * @example
 * const trueColors = await getCarTrueColors({ brand: "Toyota", primaryColor: "Red" });
 * // Output: ["Crimson", "Ruby Red", ...]
 */
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

/**
 * Generates an image URL for a car based on its specifications.
 * @param {Object} options - Options for generating car image URL.
 * @param {Object} options.car - Car details.
 * @param {string} options.car.brand - Brand of the car.
 * @param {string} options.car.model - Model of the car.
 * @param {number} options.car.year - Year of the car.
 * @param {string} [options.car.trueColor="black"] - True color of the car.
 * @param {number} [options.angle] - Angle of the image.
 * @return {string} Image URL.
 * @example
 * const imageUrl = generateCarImageUrl({ car: { brand: "Toyota", model: "Camry", year: 2022 }, angle: 90 });
 * // Output: "https://cdn.imagin.studio/getimage?..."
 */
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

/**
 * Retrieves a file from a URL.
 * @param {URL} url - URL of the file.
 * @return {Promise<FormData>} Promise resolving to a FormData object containing the file.
 * @example
 * const fileData = await getFileFromUrl(fileUrl);
 * // Output: FormData object containing the file
 */
export async function getFileFromUrl(url: URL): Promise<FormData> {
  const response = await fetch(url);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append("file", blob, "temp.webp");
  return formData;
}
