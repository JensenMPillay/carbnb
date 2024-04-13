import useAutocomplete from "@/src/hooks/useAutocomplete";
import { initialize } from "@googlemaps/jest-mocks";
import { renderHook } from "@testing-library/react";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";

jest.mock("@vis.gl/react-google-maps");

describe("useAutocomplete", () => {
  beforeEach(() => {
    initialize();
  });
  it("returns null if google maps API is not loaded", async () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(false);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    renderHook(useAutocomplete);

    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("places");
  });

  it("returns places library if google maps API loaded", () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(true);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    renderHook(useAutocomplete);

    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("places");
  });
});
