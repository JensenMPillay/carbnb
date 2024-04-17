// import { Circle } from "@/src/components/Circle";
import { Circle } from "@/src/components/Circle";
import { initialize } from "@googlemaps/jest-mocks";
import { useMap } from "@vis.gl/react-google-maps";
import { createRef } from "react";
import { render } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

const useMapMock = jest.mocked(useMap);

describe("Circle", () => {
  beforeEach(() => {
    initialize();
  });

  it("renders", () => {
    useMapMock.mockReturnValue(null);

    const circleRef = createRef<google.maps.Circle>();
    const props = {
      radius: 1000,
      center: { lat: 37.7749, lng: -122.4194 },
      strokeColor: "#4cc2ae",
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: "#4cc2ae",
      fillOpacity: 0.3,
      clickable: false,
      draggable: false,
      editable: false,
    };

    render(<Circle {...props} ref={circleRef} />);

    expect(circleRef.current).toBeDefined();
  });
});
