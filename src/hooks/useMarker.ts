"use client";
import {
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

/**
 * Custom hook to manage marker instance.
 * @returns {google.maps.MarkerLibrary | null} - Marker instance or null if not loaded.
 * @example
 * const markerLibrary = useMarker();
 */
const useMarker = () => {
  // Google Maps Libraries
  const markerInstance: google.maps.MarkerLibrary | null =
    useMapsLibrary("marker");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  // Marker Service
  const [markerLibrary, setMarkerLibrary] =
    useState<google.maps.MarkerLibrary | null>(null);

  // Parent Map
  const map = useMap();

  // Component Loaded => Instance Libraries
  useEffect(() => {
    if (IsLoaded && markerInstance) {
      setMarkerLibrary(markerInstance);
    }

    // Instances Clean
    return () => {
      setMarkerLibrary(null);
    };
  }, [IsLoaded, markerInstance]);

  // Verify Map
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("Marker has to be inside a Map component.");
      return;
    }
  }, [map]);

  return markerLibrary;
};

export default useMarker;
