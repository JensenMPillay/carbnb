import useClusterer from "@/src/hooks/useClusterer";
import { initialize, mockInstances } from "@googlemaps/jest-mocks";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { renderHook } from "@testing-library/react";
import { useMap } from "@vis.gl/react-google-maps";

jest.mock("@vis.gl/react-google-maps");

jest.mock("@googlemaps/markerclusterer");

describe("useClusterer", () => {
  beforeEach(() => {
    initialize();
    mockInstances.clearAll();
  });

  it("initializes MarkerClusterer when map is available", () => {
    const map = new google.maps.Map(document.createElement("div"), {
      mapId: "test-map-id",
    });

    jest.mocked(useMap).mockReturnValue(map);

    const rendererMock = { render: jest.fn() };

    const markerClustererMock = jest.mocked(MarkerClusterer).mockReturnValue(
      new MarkerClusterer({
        map: map,
        renderer: rendererMock,
      }),
    );

    renderHook(useClusterer);

    expect(useMap).toHaveBeenCalled();
    expect(markerClustererMock).toHaveBeenCalledWith({
      map: map,
      renderer: rendererMock,
    });
  });
});
