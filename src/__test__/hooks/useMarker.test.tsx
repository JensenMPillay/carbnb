import useMarker from "@/src/hooks/useMarker";
import { initialize } from "@googlemaps/jest-mocks";
import {
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { renderHook } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

const markerLibraryMock = jest.mocked(useMapsLibrary);

const useMapMock = jest.mocked(useMap);

const useIsApiLoadedMock = jest.mocked(useApiIsLoaded);

describe("useMarker", () => {
  beforeEach(() => {
    initialize();
    jest.clearAllMocks();
  });

  it("returns console.error() if there is no Map", async () => {
    console.error = jest.fn();
    const markerLibrary = await google.maps.importLibrary("marker");

    useIsApiLoadedMock.mockReturnValue(true);
    markerLibraryMock.mockReturnValue(markerLibrary);

    renderHook(useMarker);

    expect(useMapMock).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it("returns null if google api is not loaded", async () => {
    const markerLibrary = await google.maps.importLibrary("marker");

    useIsApiLoadedMock.mockReturnValue(false);
    markerLibraryMock.mockReturnValue(markerLibrary);
    useMapMock.mockReturnValue(null);

    const { result } = renderHook(useMarker);

    expect(result.current).toBeNull();
  });

  it("returns null if google marker library is not loaded", () => {
    useIsApiLoadedMock.mockReturnValue(true);
    markerLibraryMock.mockReturnValue(null);
    useMapMock.mockReturnValue(null);

    const { result } = renderHook(useMarker);

    expect(result.current).toBeNull();
  });

  it("returns google marker library", async () => {
    const markerLibrary = await google.maps.importLibrary("marker");

    useIsApiLoadedMock.mockReturnValue(true);
    markerLibraryMock.mockReturnValue(markerLibrary);
    useMapMock.mockReturnValue(null);

    const { result } = renderHook(useMarker);

    expect(result.current).toStrictEqual(markerLibrary);
  });
});
