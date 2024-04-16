import useClusterer from "@/src/hooks/useClusterer";
import { initialize, Map } from "@googlemaps/jest-mocks";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { renderHook } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

jest.mock("@googlemaps/markerclusterer");

const useMapMock = jest.mocked(useMap);

const markerClustererMock = jest.mocked(MarkerClusterer);

describe("useClusterer", () => {
  beforeEach(() => {
    initialize();
    jest.clearAllMocks();
  });

  it("returns console.error() if there is no Map", async () => {
    console.error = jest.fn();

    renderHook(useClusterer);

    expect(useMapMock).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it("returns marker clusterer", async () => {
    const map = new Map(document.createElement("div"), {
      mapId: "test-map-id",
    });

    useMapMock.mockReturnValue(map);

    renderHook(useClusterer);

    expect(useMapMock).toHaveBeenCalled();
    expect(markerClustererMock).toHaveBeenCalled();
  });
});
