"use client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { CarQuery } from "../@types/queries.types";
import { CarFilterSchemaType } from "../lib/schemas/car/CarSchema";
import { FormattedLocation } from "./useGeocoder";

type Props = {};

const useGeometry = () => {
  // Google Maps Libraries
  const geometryLibrary: google.maps.GeometryLibrary | null =
    useMapsLibrary("geometry");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  // Geometry Service
  const [isGeometryLoaded, setIsGeometryLoaded] = useState<boolean>(false);

  // Component Loaded => Instance Libraries
  useEffect(() => {
    if (IsLoaded && geometryLibrary) {
      setIsGeometryLoaded(true);
    }

    // Instances Clean
    return () => {
      setIsGeometryLoaded(false);
    };
  }, [IsLoaded, geometryLibrary]);

  const filterCars = useCallback(
    ({
      filters,
      cars,
      location,
    }: {
      filters: CarFilterSchemaType;
      cars: CarQuery[];
      location: FormattedLocation;
    }) => {
      // Service Not Working
      if (!geometryLibrary || !filters || !cars) {
        return null;
      }
      //   Distance Library
      const { spherical } = geometryLibrary;

      const filteredCars = cars.filter(
        ({
          brand,
          category,
          fuelType,
          pricePerDay,
          transmission,
          year,
          location: { latitude, longitude },
        }) => {
          if (filters.category && category !== filters.category) return false;

          if (filters.brand && brand !== filters.brand) return false;

          if (filters.year && year < filters.year) return false;

          if (filters.transmission && transmission !== filters.transmission)
            return false;

          if (filters.fuelType && fuelType !== filters.fuelType) return false;

          if (filters.pricePerDay && pricePerDay > filters.pricePerDay)
            return false;

          if (
            filters.radius &&
            latitude &&
            longitude &&
            spherical.computeDistanceBetween(location, {
              lat: latitude,
              lng: longitude,
            }) > filters.radius
          )
            return false;

          return true;
        },
      );
      return filteredCars;
    },
    [geometryLibrary],
  );
  return { filterCars };
};

export default useGeometry;