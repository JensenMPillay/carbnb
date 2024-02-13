"use client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

type Props = {};

const useMarker = () => {
  // Google Maps Libraries
  const markerLibrary: google.maps.MarkerLibrary | null =
    useMapsLibrary("marker");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  // Marker Service
  const [isMarkerLoaded, setIsMarkerLoaded] = useState<boolean>(false);

  // Component Loaded => Instance Libraries
  useEffect(() => {
    if (IsLoaded && markerLibrary) {
      setIsMarkerLoaded(true);
    }

    // Instances Clean
    return () => {
      setIsMarkerLoaded(false);
    };
  }, [IsLoaded, markerLibrary]);
  return isMarkerLoaded;
};

export default useMarker;
