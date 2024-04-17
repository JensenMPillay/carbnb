import { CarQuery } from "@/src/@types/queries.types";
import useGeometry from "@/src/hooks/useGeometry";
import { initialize } from "@googlemaps/jest-mocks";
import { Brand, Category, FuelType, Transmission } from "@prisma/client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { renderHook } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

function computeDistanceBetweenPoints(
  point1: {
    lat: number;
    lng: number;
  },
  point2: {
    lat: number;
    lng: number;
  },
): number {
  const earthRadius: number = 6371e3; // Rayon moyen de la Terre en mètres
  const phi1: number = (point1.lat * Math.PI) / 180; // Conversion de la latitude en radians
  const phi2: number = (point2.lat * Math.PI) / 180;
  const deltaPhi: number = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLambda: number = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a: number =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance: number = earthRadius * c;

  return distance;
}

const geometryLibraryMock = jest.mocked(useMapsLibrary).mockReturnValue({
  spherical: {
    computeDistanceBetween: jest.fn().mockImplementation((point1, point2) => {
      return computeDistanceBetweenPoints(point1, point2);
    }),
    computeArea: jest.fn(),
    computeHeading: jest.fn(),
    computeLength: jest.fn(),
    computeOffset: jest.fn(),
    computeOffsetOrigin: jest.fn(),
    computeSignedArea: jest.fn(),
    interpolate: jest.fn(),
  },
  encoding: { decodePath: jest.fn(), encodePath: jest.fn() },
  poly: { containsLocation: jest.fn(), isLocationOnEdge: jest.fn() },
});

const useIsApiLoadedMock = jest.mocked(useApiIsLoaded);

describe("useGeometry", () => {
  beforeEach(() => {
    initialize();
  });

  const carsMock = [
    {
      id: "d12e6385-58ef-4972-a02c-383cab3db476",
      category: "SEDAN",
      brand: "HONDA",
      model: "Civic",
      year: 2019,
      primaryColor: "BLACK",
      trueColor: "black-uni",
      transmission: "MANUAL",
      fuelType: "DIESEL",
      imageUrl: [
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/d12e6385-58ef-4972-a02c-383cab3db476/0",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/d12e6385-58ef-4972-a02c-383cab3db476/9",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/d12e6385-58ef-4972-a02c-383cab3db476/22",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/d12e6385-58ef-4972-a02c-383cab3db476/29",
      ],
      pricePerDay: 200,
      available: true,
      user: {
        id: "17ca0085-c6e2-4dcf-aff9-796ea448fc0c",
      },
      location: {
        id: "ChIJJZ67RmFu5kcRBaYp_fI_SDg",
        latitude: 48.8922354,
        longitude: 2.3519735,
        address: "89, Rue des Poissonniers",
        city: "Paris",
        postalCode: "75018",
        state: "Département de Paris",
        country: "France",
        formatted_address: "89 Rue des Poissonniers, 75018 Paris, France",
      },
      createdAt: new Date("2024-02-13T18:22:53.081Z"),
      updatedAt: new Date("2024-02-13T18:23:21.359Z"),
    },
    {
      id: "2187d1a8-f7bc-41b3-ba90-075fa464a746",
      category: "SUV",
      brand: "JAGUAR",
      model: "F-Pace",
      year: 2021,
      primaryColor: "ORANGE",
      trueColor: "atacama-orange-svo-ultra-metallic-gloss",
      transmission: "AUTOMATIC",
      fuelType: "ELECTRIC",
      imageUrl: [
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/0",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/9",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/22",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/2187d1a8-f7bc-41b3-ba90-075fa464a746/29",
      ],
      pricePerDay: 350,
      available: true,
      user: {
        id: "17ca0085-c6e2-4dcf-aff9-796ea448fc0c",
      },
      location: {
        id: "ChIJEQeEBwAT5kcRymwMi0k1Lgo",
        latitude: 48.9322127,
        longitude: 2.49489,
        address: "17, Rue du Onze Novembre",
        city: "Aulnay-sous-Bois",
        postalCode: "93600",
        state: "Seine-Saint-Denis",
        country: "France",
        formatted_address:
          "17 Rue du Onze Novembre, 93600 Aulnay-sous-Bois, France",
      },
      createdAt: new Date("2024-02-13T21:27:38.244Z"),
      updatedAt: new Date("2024-02-13T21:27:38.244Z"),
    },
    {
      id: "b4ec28fe-eeff-464b-8d30-591578609ea1",
      category: "SEDAN",
      brand: "MERCEDES_BENZ",
      model: "S-Class",
      year: 2017,
      primaryColor: "SILVER",
      trueColor: "diamond-white",
      transmission: "MANUAL",
      fuelType: "DIESEL",
      imageUrl: [
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/b4ec28fe-eeff-464b-8d30-591578609ea1/0",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/b4ec28fe-eeff-464b-8d30-591578609ea1/9",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/b4ec28fe-eeff-464b-8d30-591578609ea1/22",
        "https://lyqtkeirmhnfsfwpwzup.supabase.co/storage/v1/object/public/car_images/b4ec28fe-eeff-464b-8d30-591578609ea1/29",
      ],
      pricePerDay: 200,
      available: true,
      user: {
        id: "17ca0085-c6e2-4dcf-aff9-796ea448fc0c",
      },
      location: {
        id: "ChIJM-0hj1Js5kcRbiUn8wImvz8",
        latitude: 48.8971575,
        longitude: 2.405313,
        address: "100, Avenue du Général Leclerc",
        city: "Pantin",
        postalCode: "93500",
        state: "Seine-Saint-Denis",
        country: "France",
        formatted_address: "100 Av. du Général Leclerc, 93500 Pantin, France",
      },
      createdAt: new Date("2024-02-13T21:28:27.518Z"),
      updatedAt: new Date("2024-02-19T17:42:29.238Z"),
    },
  ] as CarQuery[];

  const locationMock = {
    lat: 48.624748,
    lng: 2.43085,
    description: "test-location",
  };

  const filterProps = { cars: carsMock, location: locationMock };

  it("returns null if geometry Library has not been initialized", () => {
    geometryLibraryMock.mockReturnValueOnce(null);
    useIsApiLoadedMock.mockReturnValueOnce(false);

    const filtersMock = { brand: "JAGUAR" as Brand };

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(geometryLibraryMock).toHaveBeenCalled();
    expect(useIsApiLoadedMock).toHaveBeenCalled();
    expect(filteredCars).toBeNull();
  });

  it("returns filtered cars by brand criteria", () => {
    const filtersMock = { brand: "JAGUAR" as Brand };

    const expectLength = 1;

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(filteredCars).toHaveLength(expectLength);
    expect(filteredCars?.filter((car) => car.brand === "JAGUAR")).toHaveLength(
      expectLength,
    );
  });

  it("returns filtered cars by category criteria", () => {
    const filtersMock = { category: ["SEDAN"] as Category[] };

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(filteredCars).toHaveLength(2);
    expect(
      filteredCars?.filter((car) => car.category === "SEDAN"),
    ).toHaveLength(2);
  });

  it("returns filtered cars by transmission criteria", () => {
    const filtersMock = { transmission: ["MANUAL"] as Transmission[] };

    const expectLength = 2;

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(filteredCars).toHaveLength(expectLength);
    expect(
      filteredCars?.filter((car) => car.transmission === "MANUAL"),
    ).toHaveLength(expectLength);
  });

  it("returns filtered cars by fuelType criteria", () => {
    const filtersMock = { fuelType: ["ELECTRIC"] as FuelType[] };

    const expectLength = 1;

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(filteredCars).toHaveLength(expectLength);
    expect(
      filteredCars?.filter((car) => car.fuelType === "ELECTRIC"),
    ).toHaveLength(expectLength);
  });

  it("returns filtered cars by price criteria", () => {
    const filtersMock = { pricePerDay: 300 };

    const expectLength = 2;

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(filteredCars).toHaveLength(expectLength);
    expect(
      filteredCars?.filter((car) => car.pricePerDay <= filtersMock.pricePerDay),
    ).toHaveLength(expectLength);
  });

  it("returns filtered cars by radius criteria", () => {
    const filtersMock = { radius: 32 };

    const expectLength = 2;

    const { result } = renderHook(useGeometry);

    const filteredCars = result.current.filterCars({
      ...filterProps,
      filters: filtersMock,
    });

    expect(filteredCars).toHaveLength(expectLength);
  });
});
