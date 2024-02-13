"use client";
import { Location } from "@prisma/client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export type FormattedLocation = {
  description: string;
} & google.maps.LatLngLiteral;

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

  async function getGeocodeResponse(
    placeId: string | null,
  ): Promise<google.maps.GeocoderResult | undefined> {
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
  }

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

  // Callback Handle Geocoding => Location
  const getLocation: (
    placeId: string | null,
  ) => Promise<Location | undefined> = async (placeId) => {
    // Get Response Results
    const geocodeResponse = await getGeocodeResponse(placeId);
    if (!geocodeResponse) return;

    // Values
    const {
      place_id,
      address_components,
      geometry: {
        location: { lat, lng },
      },
    }: google.maps.GeocoderResult = geocodeResponse;

    const streetNumber = getComponentValue(address_components, "street_number");
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
        streetNumber && route ? `${streetNumber}, ${route}` : route ?? subCity,
      city: city,
      postalCode: postalCode,
      state: state,
      country: country,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return location;
  };

  // Callbacks Handle Geocoding => Formatted_Address
  const getFormattedLocation: (
    placeId: string | null,
  ) => Promise<FormattedLocation | undefined> = async (placeId) => {
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
  };

  return { getLocation, getFormattedLocation };
};

export default useGeocoder;
