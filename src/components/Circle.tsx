import { forwardRef, useImperativeHandle } from "react";

import useCircle, { CircleProps, CircleRef } from "@/src/hooks/useCircle";

/**
 * Component to render a Google Maps Circle on a map
 * @component
 * @example
 * <Circle
    radius={1000},
    center={ lat: 37.7749, lng: -122.4194 },
    strokeColor={"#4cc2ae"}
    strokeOpacity={1}
    strokeWeight={3}
    fillColor={"#4cc2ae"}
    fillOpacity={0.3}
    clickable={false}
    draggable={false}
    editable={false}
  />
 */
export const Circle = forwardRef((props: CircleProps, ref: CircleRef) => {
  const circle = useCircle(props);

  useImperativeHandle(ref, () => circle);

  return null;
});

Circle.displayName = "Circle";
