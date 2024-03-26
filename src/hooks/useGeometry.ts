"use client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import { CarQuery } from "../@types/queries.types";
import { CarFilterSchemaType } from "../lib/schemas/car/CarSchema";
import { FormattedLocation } from "./useGeocoder";

/**
 * Custom hook for filtering cars based on various criteria using the Google Maps Geometry library.
 * @returns {object} - Object containing the filterCars function.
 * @example
 * const { filterCars } = useGeometry();
 */
const useGeometry = () => {
  // Google Maps Libraries
  const geometryLibrary: google.maps.GeometryLibrary | null =
    useMapsLibrary("geometry");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  // Geometry Service
  const [, setIsGeometryLoaded] = useState<boolean>(false);

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

  /**
   * Filters cars based on various criteria.
   * @param {object} options - Object containing the filters, cars, and location to filter by.
   * @param {CarFilterSchemaType} options.filters - Filters to apply to the cars.
   * @param {CarQuery[]} options.cars - List of cars to filter.
   * @param {FormattedLocation} options.location - Formatted location to use for distance filtering.
   * @returns {CarQuery[] | null} - Filtered list of cars or null if the Geometry library is not available.
   * @example
   * const { filterCars } = useGeometry();
   * const filteredCars = filterCars({ filters, cars, location });
   */
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
          if (
            filters.category &&
            filters.category.length > 0 &&
            !filters.category.includes(category)
          )
            return false;

          if (filters.brand && brand !== filters.brand) return false;

          if (filters.year && year < filters.year) return false;

          if (
            filters.transmission &&
            filters.transmission.length > 0 &&
            !filters.transmission.includes(transmission)
          )
            return false;

          if (
            filters.fuelType &&
            filters.fuelType.length > 0 &&
            !filters.fuelType.includes(fuelType)
          )
            return false;

          if (filters.pricePerDay && pricePerDay > filters.pricePerDay)
            return false;

          if (
            filters.radius &&
            latitude &&
            longitude &&
            spherical.computeDistanceBetween(location, {
              lat: latitude,
              lng: longitude,
            }) /
              1000 >
              filters.radius
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
