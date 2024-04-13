import { latLngEquals, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

import type { Ref } from "react";

type CircleEventProps = {
  onRadiusChanged?: (r: ReturnType<google.maps.Circle["getRadius"]>) => void;
  onCenterChanged?: (p: ReturnType<google.maps.Circle["getCenter"]>) => void;
};

export type CircleProps = google.maps.CircleOptions & CircleEventProps;

export type CircleRef = Ref<google.maps.Circle | null>;

/**
 * Custom hook for managing a Google Maps circle overlay.
 * @param {CircleOptions} props - Properties for configuring the circle.
 * @param {function} props.onRadiusChanged - Callback function triggered when the circle radius changes.
 * @param {function} props.onCenterChanged - Callback function triggered when the circle center changes.
 * @param {number | undefined | null} props.radius - The radius of the circle.
 * @param {google.maps.LatLngLiteral | undefined} props.center - The center position of the circle.
 * @param {string | undefined} props.fillColor - The fill color of the circle.
 * @param {string | undefined} props.strokeColor - The stroke color of the circle.
 * @param {number | undefined} props.strokeOpacity - The stroke opacity of the circle.
 * @param {number | undefined} props.strokeWeight - The stroke weight of the circle.
 * @param {boolean | undefined} props.draggable - The property draggable of the circle.
 * @returns {google.maps.Circle | null} - The Google Maps Circle object or null if not available.
 * @example
 * const { circleRef } = useCircle({
 *   radius: 1000,
 *   center: { lat: 37.7749, lng: -122.4194 },
 *    fillColor: "#FF0000",
 *    strokeColor: "#FF0000",
 *    strokeOpacity: 0.8,
 *    strokeWeight: 2,
 *    draggable: true,
 *   onRadiusChanged: (newRadius) => {
 *     console.log("Radius changed:", newRadius);
 *   },
 *   onCenterChanged: (newCenter) => {
 *     console.log("Center changed:", newCenter);
 *   }
 * });
 */
const useCircle = ({
  onRadiusChanged,
  onCenterChanged,
  radius,
  center,
  ...circleOptions
}: CircleProps) => {
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onRadiusChanged,
    onCenterChanged,
  });

  const circle = useRef(new google.maps.Circle()).current;
  // Update circleOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  circle.setOptions(circleOptions);

  // Sync Center & Radius w/ Props
  useEffect(() => {
    if (!center) return;
    if (!latLngEquals(center, circle.getCenter())) circle.setCenter(center);
  }, [circle, center]);

  useEffect(() => {
    if (radius === undefined || radius === null) return;
    if (radius !== circle.getRadius()) circle.setRadius(radius);
  }, [circle, radius]);

  const map = useMap();

  // Set Map Context
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Circle> has to be inside a Map component.");
      return;
    }

    circle.setMap(map);

    return () => {
      circle.setMap(null);
    };
  }, [map, circle]);

  // Attach and re-attach event-handlers when any of the properties change
  useEffect(() => {
    if (!circle) return;

    // Add Event listeners
    const gme = google.maps.event;
    gme.addListener(circle, "radius_changed", () => {
      const newRadius = circle.getRadius();
      callbacks.current.onRadiusChanged?.(newRadius);
    });
    gme.addListener(circle, "center_changed", () => {
      const newCenter = circle.getCenter();
      callbacks.current.onCenterChanged?.(newCenter);
      if (newCenter) circle.getMap()?.panTo(newCenter);
    });

    return () => {
      gme.clearInstanceListeners(circle);
    };
  }, [circle]);

  return circle;
};

export default useCircle;
