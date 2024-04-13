import useMarker from "@/src/hooks/useMarker";
import { initialize, mockInstances } from "@googlemaps/jest-mocks";
import { renderHook } from "@testing-library/react";
import {
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

jest.mock("@vis.gl/react-google-maps");

describe("useMarker", () => {
  beforeEach(() => {
    initialize();
    mockInstances.clearAll();
    const map = new google.maps.Map(document.createElement("div"), {
      mapId: "test-map-id",
    });

    jest.mocked(useMap).mockReturnValue(map);
  });
  it("returns null if google maps API is not loaded", () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(false);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    const { result } = renderHook(useMarker);

    expect(useMap).toHaveBeenCalled();
    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("marker");
    expect(result.current).toBeNull();
  });

  it("returns marker library if google maps API loaded", () => {
    const useApiisLoadedMock = jest
      .mocked(useApiIsLoaded)
      .mockReturnValue(true);
    const useMapsLibraryMock = jest.mocked(useMapsLibrary);

    renderHook(useMarker);

    expect(useMap).toHaveBeenCalled();
    expect(useApiisLoadedMock).toHaveBeenCalled();
    expect(useMapsLibraryMock).toHaveBeenCalledWith("marker");
  });
});
