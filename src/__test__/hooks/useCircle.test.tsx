import useCircle from "@/src/hooks/useCircle";
import { initialize, Map } from "@googlemaps/jest-mocks";
import { renderHook } from "@testing-library/react";
import { useMap } from "@vis.gl/react-google-maps";

jest.mock("@vis.gl/react-google-maps");

describe("useCircle", () => {
  beforeEach(() => {
    initialize();

    const map = new google.maps.Map(document.createElement("div"), {
      mapId: "test-map-id",
    });

    jest.mocked(useMap).mockReturnValue(map);
  });
  it("should return a circle object with specified options", () => {
    const circleOptions = {
      radius: 1000,
      center: { lat: 37.7749, lng: -122.4194 },
      fillColor: "#FF0000",
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      draggable: true,
      onRadiusChanged: jest.fn(),
      onCenterChanged: jest.fn(),
    };

    const { result } = renderHook(useCircle, {
      initialProps: circleOptions,
    });

    expect(result.current).not.toBeNull();
    expect(useMap).toHaveBeenCalled();
    expect(result.current.getMap()).toBeInstanceOf(Map);
  });
});
