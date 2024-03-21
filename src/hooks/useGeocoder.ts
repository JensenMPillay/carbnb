"use client";
import { Location } from "@prisma/client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";

export type FormattedLocation = {
  description: string;
} & google.maps.LatLngLiteral;

/**
 * Custom hook for accessing geocoding functionality from the Google Maps Geocoding Library.
 * This hook provides functions to obtain location details and formatted addresses from a place ID.
 * @returns {object} - An object containing geocoding-related functions.
 * @property {function} getLocation - A function to retrieve location details (latitude, longitude, address, city, postal code, state, country) based on a place ID.
 * @property {function} getFormattedLocation - A function to retrieve a formatted location (description, latitude, longitude) based on a place ID.
 * @example
 * const { getLocation, getFormattedLocation } = useGeocoder();
 */
const useGeocoder = () => {
  // Google Maps Libraries
  const geocodingLibrary: google.maps.GeocodingLibrary | null =
    useMapsLibrary("geocoding");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  // Component Loaded => Instance Libraries
  useEffect(() => {
    if (IsLoaded && geocodingLibrary) {
      setGeocoder(new geocodingLibrary.Geocoder());
    }

    // Instances Clean
    return () => {
      setGeocoder(null);
    };
  }, [IsLoaded, geocodingLibrary]);

  const getGeocodeResponse = useCallback(
    async (placeId: string | null) => {
      // Service Not Working
      if (!geocoder || !placeId) {
        return;
      }

      // Request
      const request: google.maps.GeocoderRequest = {
        placeId: placeId,
      };

      // Response Results
      const response = (await geocoder.geocode(request)).results[0];
      return response;
    },
    [geocoder],
  );

  // Destruct Address Component
  function getComponentValue(
    address_components: google.maps.GeocoderAddressComponent[],
    type: string,
  ): string {
    const component = address_components.find((component) =>
      component.types.includes(type),
    );
    return component?.long_name || "";
  }

  /**
   * Retrieves location details based on a place ID.
   * @param {string | null} placeId - The place ID of the location.
   * @returns {Promise<Location | undefined>} - A promise that resolves to the location details or undefined if no location is found.
   * @example
   * const { getLocation } = useGeocoder();
   * const placeId = "your-place-id";
   * const location = await getLocation(placeId)
   * // Output: { id: 'your-place-id', latitude: 123.456, longitude: 78.910, address: '123 Street, City', city: 'City', postalCode: '12345', state: 'State', country: 'Country', formatted_address: '123 Street, City, State, Country', createdAt: Date, updatedAt: Date }
   */
  const getLocation = useCallback(
    async (placeId: string | null) => {
      // Get Response Results
      const geocodeResponse = await getGeocodeResponse(placeId);
      if (!geocodeResponse) return;

      // Values
      const {
        place_id,
        formatted_address,
        address_components,
        geometry: {
          location: { lat, lng },
        },
      }: google.maps.GeocoderResult = geocodeResponse;

      const streetNumber = getComponentValue(
        address_components,
        "street_number",
      );
      const route = getComponentValue(address_components, "route");
      const subCity = getComponentValue(address_components, "sublocality");
      const city = getComponentValue(address_components, "locality");
      const postalCode = getComponentValue(address_components, "postal_code");
      const state = getComponentValue(
        address_components,
        "administrative_area_level_2",
      );
      const country = getComponentValue(address_components, "country");

      // Return Data
      const location: Location = {
        id: place_id,
        latitude: lat(),
        longitude: lng(),
        address:
          streetNumber && route
            ? `${streetNumber}, ${route}`
            : route ?? subCity,
        city: city,
        postalCode: postalCode,
        state: state,
        country: country,
        formatted_address: formatted_address,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return location;
    },
    [getGeocodeResponse],
  );

  /**
   * Retrieves a formatted location description based on a place ID.
   * @param {string | null} placeId - The place ID of the location.
   * @returns {Promise<FormattedLocation | undefined>} - A promise that resolves to the formatted location or undefined if no location is found.
   * @example
   * const { getFormattedLocation } = useGeocoder();
   * const placeId = "your-place-id";
   * const location = await getLocation(placeId)
   * // Output: { description: '123 Street, City, State, Country', lat: 123.456, lng: 78.910 }
   */
  const getFormattedLocation = useCallback(
    async (placeId: string | null) => {
      // Get Response Results
      const geocodeResponse = await getGeocodeResponse(placeId);
      if (!geocodeResponse) return;

      // Values
      const {
        formatted_address,
        geometry: {
          location: { lat, lng },
        },
      }: google.maps.GeocoderResult = geocodeResponse;

      // Return Data
      const formattedLocation: FormattedLocation = {
        description: formatted_address ?? "",
        lat: lat(),
        lng: lng(),
      };
      return formattedLocation;
    },
    [getGeocodeResponse],
  );

  return { getLocation, getFormattedLocation };
};

export default useGeocoder;
