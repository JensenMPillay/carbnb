import useGeocoder from "@/src/hooks/useGeocoder";
import { Geocoder, initialize, mockInstances } from "@googlemaps/jest-mocks";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { renderHook } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

const useMapsLibraryMock = jest.mocked(useMapsLibrary);

const useApiisLoadedMock = jest.mocked(useApiIsLoaded).mockReturnValue(true);

const placeIdMock = "ChIJLU7jZClu5kcR4PcOOO6p3I0";

const responseMock = {
  results: [
    {
      place_id: placeIdMock,
      formatted_address:
        "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
      address_components: [
        {
          long_name: "Tour Eiffel",
          short_name: "Tour Eiffel",
          types: ["point_of_interest", "establishment"],
        },
        {
          long_name: "Champ de Mars",
          short_name: "Champ de Mars",
          types: ["political", "sublocality", "sublocality_level_1"],
        },
        {
          long_name: "5",
          short_name: "5",
          types: ["street_number"],
        },
        {
          long_name: "Avenue Anatole France",
          short_name: "Ave Anatole France",
          types: ["route"],
        },
        {
          long_name: "Paris",
          short_name: "Paris",
          types: ["locality", "political"],
        },
        {
          long_name: "Paris",
          short_name: "Paris",
          types: ["administrative_area_level_2", "political"],
        },
        {
          long_name: "Île-de-France",
          short_name: "Île-de-France",
          types: ["administrative_area_level_1", "political"],
        },
        {
          long_name: "France",
          short_name: "FR",
          types: ["country", "political"],
        },
        {
          long_name: "75007",
          short_name: "75007",
          types: ["postal_code"],
        },
      ],
      geometry: {
        location: {
          lat: () => 48.85837009999999,
          lng: () => 2.2944813,
          equals: () => false,
          toJSON: () => ({ lat: 48.85837009999999, lng: 2.2944813 }),
          toUrlValue: () => "48.8583701,2.2944813",
        },
      },
      types: ["point_of_interest", "establishment"],
    },
  ],
  status: "OK",
};

const [resultMock] = responseMock.results;

describe("useGeocoder", () => {
  beforeEach(() => {
    initialize();
  });

  it("returns geocoding library if google maps API loaded", async () => {
    const geocodingLibrary = await google.maps.importLibrary("geocoding");

    useMapsLibraryMock.mockReturnValue(geocodingLibrary);

    renderHook(useGeocoder);

    const [geocoderMock] = mockInstances.get(Geocoder);

    expect(useApiIsLoaded).toHaveBeenCalled();
    expect(useMapsLibrary).toHaveBeenCalledWith("geocoding");
    expect(geocoderMock).toBeDefined();
  });

  it("returns function => undefined with no Geocoder", async () => {
    useMapsLibraryMock.mockReturnValue(null);

    const { result } = renderHook(useGeocoder);

    const locationMock = await result.current.getLocation(placeIdMock);
    const locationFormattedMock =
      await result.current.getFormattedLocation(placeIdMock);

    expect(locationMock).toBeUndefined();
    expect(locationFormattedMock).toBeUndefined();
  });

  it("returns function => undefined with no Api Loaded", async () => {
    useApiisLoadedMock.mockReturnValueOnce(false);

    const { result } = renderHook(useGeocoder);

    const locationMock = await result.current.getLocation(placeIdMock);
    const locationFormattedMock =
      await result.current.getFormattedLocation(placeIdMock);

    expect(locationMock).toBeUndefined();
    expect(locationFormattedMock).toBeUndefined();
  });

  it("returns getLocation() result", async () => {
    const geocodingLibrary = await google.maps.importLibrary("geocoding");

    useMapsLibraryMock.mockReturnValue(geocodingLibrary);

    const { result } = renderHook(useGeocoder);

    const [geocoderMock] = mockInstances.get(Geocoder);

    geocoderMock?.geocode.mockResolvedValue(responseMock);

    const locationMock = await result.current.getLocation(placeIdMock);

    expect(locationMock?.id).toBe(resultMock?.place_id);
    expect(locationMock?.latitude).toBe(resultMock?.geometry.location.lat());
    expect(locationMock?.longitude).toBe(resultMock?.geometry.location.lng());
    expect(locationMock?.address).toBe("5, Avenue Anatole France");
    expect(locationMock?.city).toBe("Paris");
    expect(locationMock?.postalCode).toBe("75007");
    expect(locationMock?.state).toBe("Paris");
    expect(locationMock?.country).toBe("France");
    expect(locationMock?.formatted_address).toBe(resultMock?.formatted_address);
    expect(locationMock?.createdAt).toBeInstanceOf(Date);
    expect(locationMock?.updatedAt).toBeInstanceOf(Date);
  });

  it("returns getFormattedLocation() result", async () => {
    const geocodingLibrary = await google.maps.importLibrary("geocoding");

    useMapsLibraryMock.mockReturnValue(geocodingLibrary);

    const { result } = renderHook(useGeocoder);

    const [geocoderMock] = mockInstances.get(Geocoder);

    geocoderMock?.geocode.mockResolvedValue(responseMock);

    const locationMock = await result.current.getFormattedLocation(placeIdMock);

    expect(locationMock?.description).toBe(resultMock?.formatted_address);
    expect(locationMock?.lat).toBe(resultMock?.geometry.location.lat());
    expect(locationMock?.lng).toBe(resultMock?.geometry.location.lng());
  });
});
