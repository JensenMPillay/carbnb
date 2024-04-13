import useGeometry from "@/src/hooks/useGeometry";
import { initialize } from "@googlemaps/jest-mocks";
import { renderHook } from "@testing-library/react";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";

jest.mock("@vis.gl/react-google-maps");

describe("useGeometry", () => {
  beforeEach(() => {
    initialize();
  });
  it("returns null if google maps API is not loaded", () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(true);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);
    const locationMock = {
      lat: 50.8922354,
      lng: 2.5519735,
      description: "test-location",
    };

    const { result } = renderHook(useGeometry);

    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("geometry");
    expect(
      result.current.filterCars({
        filters: { radius: 1000 },
        cars: [],
        location: locationMock,
      }),
    ).toBeNull();
  });

  it("returns geometry library if google maps API loaded", () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(true);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    renderHook(useGeometry);

    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("geometry");
  });
});
