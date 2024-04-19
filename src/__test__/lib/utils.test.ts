import { IMAGE_ANGLES } from "@/src/config/supabase";
import {
  absoluteUrl,
  cn,
  constructMetadata,
  createSVGClustererIcon,
  extractCarColorsMap,
  generateCarImageUrl,
  generateCarModelsSearchUrl,
  generateCarPaintsUrl,
  getCarModels,
  getCarPaintCombinations,
  getCarTrueColors,
  getFileFromUrl,
  hslToHex,
} from "@/src/lib/utils";
import { Brand } from "@prisma/client";

describe("cn", () => {
  it("should return classNames string", () => {
    const classNames = cn("text-xl", "bg-blue-500", { rounded: true });
    expect(classNames).toBe("text-xl bg-blue-500 rounded");
  });
});

describe("absoluteUrl", () => {
  it("should generate correct absolute URL for environment", () => {
    const url = absoluteUrl("/home");
    if (typeof window !== "undefined") expect(url).toBe("/home");
  });
});

describe("constructMetadata", () => {
  it("should return default metadata when no parameters are provided", () => {
    const metadata = constructMetadata();
    expect(metadata.title).toBe("CarBnb");
    expect(metadata.description).toBe("AirBnb for Cars");
    expect(metadata.openGraph?.title).toBe("CarBnb");

    expect(metadata.openGraph?.description).toBe("AirBnb for Cars");
    // @ts-expect-error type OGImage = string | OGImageDescriptor | URL;
    expect(metadata.openGraph?.images?.url).toBe("/thumbnail.png");
    // @ts-expect-error type Twitter = TwitterSummary | TwitterSummaryLargeImage | TwitterPlayer | TwitterApp | TwitterMetadata;
    expect(metadata.twitter?.card).toBe("summary_large_image");
    expect(metadata.twitter?.title).toBe("CarBnb");
    expect(metadata.twitter?.description).toBe("AirBnb for Cars");
    expect(metadata.twitter?.creator).toBe("@jensenmpillay");
    expect(metadata.icons).toBe("/favicon.ico");
    expect(metadata.metadataBase?.href).toBe("http://localhost:3000/");
    expect(metadata.robots).toBeUndefined();
  });

  it("should override default values with provided parameters", () => {
    const metadata = constructMetadata({
      title: "My CarBnb",
      description: "My Custom Description",
      image: "/custom-thumbnail.png",
      icons: "/custom-favicon.ico",
      noIndex: true,
    });
    expect(metadata.title).toBe("My CarBnb");
    expect(metadata.description).toBe("My Custom Description");
    expect(metadata.openGraph?.title).toBe("My CarBnb");
    expect(metadata.openGraph?.description).toBe("My Custom Description");
    // @ts-expect-error type OGImage = string | OGImageDescriptor | URL;
    expect(metadata.openGraph?.images?.url).toBe("/custom-thumbnail.png");
    // @ts-expect-error type Twitter = TwitterSummary | TwitterSummaryLargeImage | TwitterPlayer | TwitterApp | TwitterMetadata;
    expect(metadata.twitter?.card).toBe("summary_large_image");
    expect(metadata.twitter?.title).toBe("My CarBnb");
    expect(metadata.twitter?.description).toBe("My Custom Description");
    expect(metadata.twitter?.images).toBe("/custom-thumbnail.png");
    expect(metadata.twitter?.creator).toBe("@jensenmpillay");
    expect(metadata.icons).toBe("/custom-favicon.ico");
    expect(metadata.metadataBase?.href).toBe("http://localhost:3000/");
    expect(metadata.robots).toEqual({
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
    });
  });
});

describe("hslToHex", () => {
  it("should convert HSL color to hexadecimal format", () => {
    const hslColor = "210 50% 75%";
    const expectedHexColor = "#9fbfdf";
    expect(hslToHex(hslColor)).toBe(expectedHexColor);
  });

  it("should return empty string if input format is invalid", () => {
    const invalidHslColor = "invalidColor";
    expect(hslToHex(invalidHslColor)).toBe("");
  });
});

describe("createSVGClustererIcon", () => {
  it("should create an SVG icon with the specified color and count", () => {
    const color = "#ff0000";
    const count = 5;
    const svgIcon = createSVGClustererIcon(color, count);

    // SVG element
    expect(svgIcon.tagName).toBe("svg");

    // SVG shape w/ count
    expect(svgIcon.getElementsByTagName("circle").length).toBe(4);
    expect(svgIcon.getElementsByTagName("text").length).toBe(1);

    // Count value
    const textElement = svgIcon.getElementsByTagName("text")[0];
    expect(textElement).toHaveTextContent(count.toString());
  });
});

describe("generateCarModelsSearchUrl", () => {
  it("should generate the correct search URL for a given brand and year", () => {
    const options = { brand: "Toyota", year: 2022 };

    const searchUrl = generateCarModelsSearchUrl(options);

    const expectedUrl =
      "https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model@public/records?select=basemodel&group_by=basemodel&where=make%20LIKE%20%22Toyota%22%20AND%20YEAR(year)%3D2022";

    expect(searchUrl).toBe(expectedUrl);
  });
});

describe("getCarModels", () => {
  it("should fetch car models based on brand and year", async () => {
    const options = { brand: "Toyota", year: 2022 };

    const models = await getCarModels(options);

    const expectedModels = [
      "4Runner",
      "Avalon",
      "C-HR",
      "Camry",
      "Corolla",
      "Corolla Cross",
      "GR 86",
      "GR Supra",
      "Highlander",
      "Prius",
      "Prius Prime",
      "RAV4",
      "RAV4 Prime",
      "Sequoia",
      "Sienna",
      "Tacoma",
      "Tundra",
      "Venza",
    ];

    expect(models).toStrictEqual(expectedModels);
  });
});

describe("generateCarPaintsUrl", () => {
  it("should generate the correct URL for fetching car paints based on the brand", () => {
    const options = { target: "make", brand: "Toyota" };

    const carPaintsUrl = generateCarPaintsUrl(options);

    const expectedUrl = new URL("https://cdn.imagin.studio/getPaints");
    expectedUrl.searchParams.append(
      "customer",
      process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "",
    );
    expectedUrl.searchParams.append("target", options.target);
    expectedUrl.searchParams.append(options.target, options.brand);

    expect(carPaintsUrl.toString()).toBe(expectedUrl.toString());
  });
});

describe("getCarPaintCombinations", () => {
  it("should retrieve paint combinations for a given URL", async () => {
    const testUrl = new URL(
      `https://cdn.imagin.studio/getPaints?customer=${process.env.NEXT_PUBLIC_IMAGIN_API_KEY}&target=make&make=Toyota`,
    );

    const combinations = await getCarPaintCombinations({ url: testUrl });

    Object.keys(combinations).forEach((key) => {
      expect(key).toMatch(/^pspc/);
    });
  });
});

describe("extractCarColorsMap", () => {
  it("Extract car colors map from paint combinations data", () => {
    const paintCombinations = {
      pspc0016: {
        paintSwatch: {
          primary: {
            lowLight: "#0b163c",
            midLight: "#2e3964",
            highLight: "#56679f",
            colourCluster: "blue",
            paintType: "mic",
          },
        },
        mapped: {
          "14752": {
            paintDescription: "starlight-blue-metallic",
            nativePaintDescriptions: [
              "metallicplus-plusmagnetiteplusgrey",
              "metallicplus-plustyrolplussilver",
              "pearlplus-plusscarletplusflare",
              "pearlplus-plussterlingplussilver",
              "metallicplus-plusstarlightplusblue",
            ],
          },
          "122921": {
            paintDescription: "blue-metallic",
            nativePaintDescriptions: ["blue"],
          },
          "174820": {
            paintDescription: "metallic-juniper-blue",
            nativePaintDescriptions: ["metallicplus-plusjuniperplusblue"],
          },
          "175267": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["bi-tone-metallic-juniper-blueplus"],
          },
          "180786": {
            paintDescription: "metallic-juniper-blue",
            nativePaintDescriptions: ["metallicplus-plusjuniperplusblue"],
          },
          "30527690": {
            paintDescription: "midnight-blue-metallic",
            nativePaintDescriptions: ["midnight-blue-metallic"],
          },
          "30731281": {
            paintDescription: "mid-night-blue-metallic",
            nativePaintDescriptions: ["mid-night-blue"],
          },
          "32446513": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32446514": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32446515": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32446576": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32776093": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32776094": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32780350": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "32780383": {
            paintDescription: "midnight-blue-metallic",
            nativePaintDescriptions: ["midnight blue metallic"],
          },
          "33575492": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper blue metallic"],
          },
          "8y8": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper-blue-metallicplus"],
          },
          imjszxugz2vuacoodnjligjplxrvbibtw6l0ywxsaxpdqsi: {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["bleu genièvre bi-ton métallisé"],
          },
          "tom-ebc5djb": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper-blue"],
          },
          "tosp-69b56jbb": {
            paintDescription: "juniper-blue-metallic",
            nativePaintDescriptions: ["juniper-blue-bi-tone"],
          },
        },
      },
      pspc0016sspc0004: {
        paintSwatch: {
          primary: {
            lowLight: "#0b163c",
            midLight: "#2e3964",
            highLight: "#56679f",
            colourCluster: "blue",
            paintType: "mic",
          },
          secondary: {
            lowLight: "#0c0c0b",
            midLight: "#252424",
            highLight: "#545453",
            colourCluster: "black",
            paintType: "uni",
          },
        },
        mapped: {
          "169351": {
            paintDescription: "juniper-blue-metallic-with-black",
            nativePaintDescriptions: [
              "bi-toneplusmetallicplus-plusjuniperplusblue",
            ],
          },
          "31552327": {
            paintDescription: "juniper-blue-with-zwart-roof",
            nativePaintDescriptions: ["juniper blue / zwart dak"],
          },
          "32253196": {
            paintDescription: "juniper-blue-with-zwart-dak",
            nativePaintDescriptions: ["juniper blue / zwart dak"],
          },
          "33390944": {
            paintDescription: "midnight-blue-metallic-zwart-dak",
            nativePaintDescriptions: ["midnight blue metallic / zwart dak"],
          },
          "2vl": {
            paintDescription: "juniper-blue-metallic-with-zwart-uni-roof",
            nativePaintDescriptions: [
              "buitenkleur-is-blauw",
              "couleur-exterieure:-bleu",
              "external-color:-blue",
              "juniper blue / zwart dak",
              "juniper-blue-/-zwart-dak",
              "juniper-blue-zwart-dak",
              "juniper-blue/zwart-dak",
              "nagoyablau-metallic-dach-nightsky-black-mica",
            ],
          },
          imjplxrvbi1ibgv1lwdlbmndqhzyzs1tw6l0ywwvdg9pdc1ub2lyig: {
            paintDescription: "juniper-blue-with-black",
            nativePaintDescriptions: ["bi-ton-bleu-genièvre-métal/toit-noir"],
          },
          imjplxrvbibibgv1igdlbmndqhzyzsbtw6l0ywwvdg9pdcbub2lyig: {
            paintDescription: "bi-ton-bleu-genivre-metallic/toit-noir",
            nativePaintDescriptions: ["bi-ton bleu genièvre métal/toit noir"],
          },
          "tom-35a1fjbb": {
            paintDescription: "juniper-blue-metallic-with-black",
            nativePaintDescriptions: ["juniper-blue-bi-tone"],
          },
        },
      },
      pspc0019: {
        paintSwatch: {
          primary: {
            lowLight: "#65594f",
            midLight: "#93867c",
            highLight: "#c6bdb5",
            colourCluster: "beige",
            paintType: "mic",
          },
        },
        mapped: {
          "13857": {
            paintDescription: "rich-oak-brown-metallic",
            nativePaintDescriptions: ["metallic-rich-oak"],
          },
          "87853": {
            paintDescription: "metallic-light-cappuccino",
            nativePaintDescriptions: ["metallic-light-cappuccino"],
          },
          "96773": {
            paintDescription: "rich-oak-metallic",
            nativePaintDescriptions: [
              "metallic-rich-oak",
              "rich-oak-metallic-paint",
            ],
          },
          bto: {
            paintDescription: "jasny-braz",
            nativePaintDescriptions: ["jasny-braz"],
          },
          kcm: {
            paintDescription: "metallic-oak-brown",
            nativePaintDescriptions: [
              "barrique-braun-metallic",
              "marron-rich-met",
              "metallic-oak-brown",
            ],
          },
          "tom-56c96ro": {
            paintDescription: "rich-oak-brown-metallic",
            nativePaintDescriptions: ["rich-oak"],
          },
        },
      },
      pspc0199: {
        paintSwatch: {
          primary: {
            lowLight: "#272d2e",
            midLight: "#4b5354",
            highLight: "#737a7c",
            colourCluster: "dark grey",
            paintType: "unk",
          },
        },
        mapped: {
          "55284": {
            paintDescription: "charcoal-grey-metallic",
            nativePaintDescriptions: ["charcoalplusgreyplus(metallic)"],
          },
          "56446": {
            paintDescription: "charcoal-grey-metallic",
            nativePaintDescriptions: [
              "charcoalplusgreyplusmetalliccharcoalplusgreyplusmetallic",
            ],
          },
          "60333": {
            paintDescription: "charcoal-grey",
            nativePaintDescriptions: ["charcoalplusgrey"],
          },
          "133396": {
            paintDescription: "tone-metallic-bi",
            nativePaintDescriptions: [
              "ash-grey",
              "gr-sport-manhattan-grey-bi-tone-metallic-paint",
              "manhattan-grey-bi-tone-metallic-paint",
              "manhattan-grey-metallic-dak-zwart",
            ],
          },
          "158408": {
            paintDescription: "tone-metallic-bi",
            nativePaintDescriptions: [
              "ash-grey",
              "gr-sport-manhattan-grey-bi-tone-metallic-paint",
              "manhattan-grey-bi-tone-metallic-paint",
              "manhattan-grey-metallic-dak-zwart",
            ],
          },
          "162374": {
            paintDescription: "tone-metallic-bi",
            nativePaintDescriptions: [
              "ash-grey",
              "bi-tone-metallic-manhattan-grey/black",
              "gr-sport-manhattan-grey-bi-tone-metallic-paint",
              "manhattan-grey-bi-tone-metallic-paint",
              "manhattan-grey-metallic-dak-zwart",
            ],
          },
          "1-00eplus00": {
            paintDescription: "charcoal-grey-metallic",
            nativePaintDescriptions: [
              "charcoal-grey-metallic/oranje-dak",
              "charcoal-grey-metallic",
            ],
          },
          "1e0": {
            paintDescription: "gris-eclipse-metallise",
            nativePaintDescriptions: [
              "charcoal-grey-metallic",
              "charcoal-grey-metallic-oranje-dak",
              "charcoal-grey-metallic/oranje-dak",
              "gris-eclipse-metallise",
              "rauchgrau-mica",
              "rauchgrau-mica-mit-dach-in-mandarine",
              "x-gris-oscuro-met",
            ],
          },
          "2qs": {
            paintDescription: "tone-metallic-bi",
            nativePaintDescriptions: [
              "londonplusgrey&blackplusmet",
              "manhattan-grey-metallic-plus-dak-zwart",
              "manhattangrau-metallic-slash-schwarzplus7e8588",
              "manhatten grey / zwart dak",
              "manhatten grey metallic / zwart dak",
              "manhatten-grey-metallic-/-zwart-dak",
              "manhatten-grey-metallic-zwart-dak",
              "ash-grey",
              "bitono-gris-manhattan-met",
              "bitono-gris-manhattan/techo-negro",
              "buitenkleur-is-grijs",
              "cement-grey",
              "couleur-exterieure:-gris",
              "external-color:-gray",
              "gr-sport-manhattan-grey-bi-tone-metallic-paint",
              "manhatten-grey-zwart-dak",
            ],
          },
          im1hz25ldgljlwdyyxktbwv0ywxsawmi: {
            paintDescription: "magnetic-gray-metallic",
            nativePaintDescriptions: ["magnetic-gray-metallic"],
          },
          imnoyxjjb2fslwdyzxki: {
            paintDescription: "charcoal-grey-metallic",
            nativePaintDescriptions: ["charcoal-grey"],
          },
          imnoyxjjb2fslwdyzxktbwv0ywxsawmi: {
            paintDescription: "charcoal-grey-metallic",
            nativePaintDescriptions: ["charcoal-grey-metallic"],
          },
          p8y: {
            paintDescription: "gris-oscuro-kikuchiyo-mettallic",
            nativePaintDescriptions: ["gris-oscuro-kikuchiyo-metplus38383d"],
          },
          sae: {
            paintDescription: "charcoal-grey-metallic",
            nativePaintDescriptions: ["charcoal-grey-metallic"],
          },
        },
      },
      pspc0027: {
        paintSwatch: {
          primary: {
            lowLight: "#454751",
            midLight: "#70727d",
            highLight: "#a0a3ad",
            colourCluster: "grey",
            paintType: "unk",
          },
        },
        mapped: {
          "136268": {
            paintDescription: "",
            nativePaintDescriptions: ["metallic-magnetite-grey"],
          },
          "180439": {
            paintDescription: "premium-metallic-moearki-grey",
            nativePaintDescriptions: [
              "premiumplusmetallicplus-plusmoearkiplusgrey",
            ],
          },
          "242425-grey-metallic": {
            paintDescription: "magnetic-grey-metallic",
            nativePaintDescriptions: ["grey-metallic"],
          },
          im1ldgfsbgljic0gbwfnbmv0axrligdyzxki: {
            paintDescription: "magnetite-grey-metallic",
            nativePaintDescriptions: ["metallic - magnetite grey"],
          },
          pn4dq: {
            paintDescription: "magnetic-grey-metallic",
            nativePaintDescriptions: ["magnetic-m"],
          },
          "tom-ff348mg": {
            paintDescription: "moearki-grey-metallic",
            nativePaintDescriptions: ["moearki-grey"],
          },
        },
      },
    };

    const expectedColorsMap = {
      aqua: [],
      beige: [
        "rich-oak-brown-metallic",
        "metallic-light-cappuccino",
        "rich-oak-metallic",
        "jasny-braz",
        "metallic-oak-brown",
      ],
      black: [],
      blue: [
        "starlight-blue-metallic",
        "blue-metallic",
        "metallic-juniper-blue",
        "juniper-blue-metallic",
        "midnight-blue-metallic",
        "mid-night-blue-metallic",
        "juniper-blue-metallic-with-black",
        "juniper-blue-with-zwart-roof",
        "juniper-blue-with-zwart-dak",
        "midnight-blue-metallic-zwart-dak",
        "juniper-blue-metallic-with-zwart-uni-roof",
        "juniper-blue-with-black",
        "bi-ton-bleu-genivre-metallic/toit-noir",
      ],
      brown: [],
      fuchsia: [],
      green: [],
      grey: [
        "premium-metallic-moearki-grey",
        "magnetic-grey-metallic",
        "magnetite-grey-metallic",
        "moearki-grey-metallic",
      ],
      lime: [],
      maroon: [],
      navy: [],
      olive: [],
      orange: [],
      pink: [],
      purple: [],
      red: [],
      silver: [],
      teal: [],
      violet: [],
      white: [],
      yellow: [],
      "dark grey": [
        "charcoal-grey-metallic",
        "charcoal-grey",
        "tone-metallic-bi",
        "gris-eclipse-metallise",
        "magnetic-grey-metallic",
        "gris-oscuro-kikuchiyo-mettallic",
      ],
    };

    const colorsMap = extractCarColorsMap({ paintCombinations });

    expect(typeof colorsMap).toBe("object");

    // ColorsMap[colourCluster] exist
    Object.values(paintCombinations).forEach(({ paintSwatch }) => {
      const { colourCluster } = paintSwatch.primary;
      expect(colorsMap[colourCluster]).toBeDefined();
    });

    // ColourCluster => Array
    Object.values(colorsMap).forEach((value) => {
      expect(Array.isArray(value)).toBe(true);
      // Description != "gray"
      value.forEach((description) => {
        expect(description).not.toContain("gray");
      });
    });

    expect(colorsMap).toStrictEqual(expectedColorsMap);
  });
});

describe("getCarTrueColors", () => {
  it("returns an array of true colors for a given brand and primary color", async () => {
    const options = { brand: "Porsche", primaryColor: "Orange" };

    const expectedTrueColors = [
      "papaya-metallic",
      "porsche-metallic-papaya",
      "porscheplusmetallicplus-pluspapaya",
      "goldgelb",
      "orange-fusion",
    ];

    const trueColors = await getCarTrueColors(options);

    expect(trueColors).toStrictEqual(expectedTrueColors);
  });
});

describe("generateCarImageUrl", () => {
  it("generates the correct image URL for a car", () => {
    const options = {
      car: {
        brand: "Toyota" as Brand,
        model: "Camry",
        year: 2022,
        trueColor: "black",
      },
      angle: "29" as (typeof IMAGE_ANGLES)[number],
    };
    const imageUrl = generateCarImageUrl(options);

    const expectedUrl = `https://cdn.imagin.studio/getimage?customer=${process.env.NEXT_PUBLIC_IMAGIN_API_KEY}&make=${options.car.brand}&modelFamily=${options.car.model}&modelRange=&modelYear=${options.car.year}&paintDescription=${options.car.trueColor}&countryCode=FR&zoomType=fullscreen&angle=${options.angle}`;

    expect(imageUrl).toBe(expectedUrl);
  });

  it("generates the correct image URL for a car with default trueColor", () => {
    const options = {
      car: {
        brand: "Toyota" as Brand,
        model: "Camry",
        year: 2022,
      },
    };

    const imageUrl = generateCarImageUrl(options);

    const expectedUrl = `https://cdn.imagin.studio/getimage?customer=${process.env.NEXT_PUBLIC_IMAGIN_API_KEY}&make=${options.car.brand}&modelFamily=${options.car.model}&modelRange=&modelYear=${options.car.year}&paintDescription=black&countryCode=FR&zoomType=fullscreen`;

    expect(imageUrl).toBe(expectedUrl);
  });
});

describe("getFileFromUrl", () => {
  it("fetches a file from a URL and returns it as FormData", async () => {
    const url = new URL(
      `https://cdn.imagin.studio/getimage?customer=${process.env.NEXT_PUBLIC_IMAGIN_API_KEY}&make=Toyota&modelFamily=Camry&modelRange=&modelYear=2022&paintDescription=black&countryCode=FR&zoomType=fullscreen`,
    );

    const formData = await getFileFromUrl(url);

    expect(formData).toBeInstanceOf(FormData);

    const blob = formData.get("file");

    expect(blob).toBeInstanceOf(Blob);
    if (blob instanceof Blob) expect(blob.type).toBe("image/webp");
  });
});
