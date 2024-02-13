import { forwardRef, useImperativeHandle } from "react";

import useCircle, { CircleProps, CircleRef } from "../hooks/useCircle";

/**
 * Component to render a Google Maps Circle on a map
 */
export const Circle = forwardRef((props: CircleProps, ref: CircleRef) => {
  const circle = useCircle(props);

  useImperativeHandle(ref, () => circle);

  return null;
});

Circle.displayName = "Circle";
