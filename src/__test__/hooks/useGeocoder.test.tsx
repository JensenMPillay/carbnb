import useGeocoder from "@/src/hooks/useGeocoder";
import { initialize } from "@googlemaps/jest-mocks";
import { renderHook } from "@testing-library/react";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";

jest.mock("@vis.gl/react-google-maps");

describe("useGeocoder", () => {
  beforeEach(() => {
    initialize();
  });
  it("returns null if google maps API is not loaded", async () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(false);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    renderHook(useGeocoder);

    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("geocoding");
  });

  it("returns geocoding library if google maps API loaded", () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(true);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    renderHook(useGeocoder);

    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("geocoding");
  });
});
