import useCircle from "@/src/hooks/useCircle";
import { initialize } from "@googlemaps/jest-mocks";
import { latLngEquals, useMap } from "@vis.gl/react-google-maps";
import { renderHook } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

const useMapMock = jest.mocked(useMap);

const latLngEqualsMock = jest.mocked(latLngEquals);

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

describe("useCircle", () => {
  beforeEach(() => {
    initialize();
  });

  it("returns console.error() if there is no Map", async () => {
    console.error = jest.fn();

    renderHook(useCircle, { initialProps: circleOptions });

    expect(useMapMock).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it("returns a circle object with specified options", async () => {
    useMapMock.mockReturnValue(null);

    const { result } = renderHook(useCircle, { initialProps: circleOptions });

    expect(useMapMock).toHaveBeenCalled();
    expect(latLngEqualsMock).toHaveBeenCalled();
    expect(result.current).toBeTruthy();
  });
});
