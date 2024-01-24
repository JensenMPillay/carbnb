"use client";
import { Location } from "@prisma/client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

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

  // Callback Handle Geocoding
  const getLocation = async (placeId: string | null) => {
    // Service Not Working
    if (!geocoder || !placeId) {
      return;
    }

    const request: google.maps.GeocoderRequest = {
      placeId: placeId,
    };

    const {
      place_id,
      address_components,
      geometry: {
        location: { lat, lng },
      },
    }: google.maps.GeocoderResult = (await geocoder.geocode(request))
      .results[0];

    // Destruct Address Component
    function getComponentValue(
      address_components: google.maps.GeocoderAddressComponent[],
      type: string,
    ) {
      const component = address_components.find((component) =>
        component.types.includes(type),
      );
      return component?.long_name || "";
    }

    const streetNumber = getComponentValue(address_components, "street_number");
    const route = getComponentValue(address_components, "route");
    const city = getComponentValue(address_components, "locality");
    const postalCode = getComponentValue(address_components, "postal_code");
    const state = getComponentValue(
      address_components,
      "administrative_area_level_2",
    );
    const country = getComponentValue(address_components, "country");

    // Set Data
    const location: Location = {
      id: place_id,
      latitude: lat(),
      longitude: lng(),
      address: streetNumber ? `${streetNumber}, ${route}` : route,
      city: city,
      postalCode: postalCode,
      state: state,
      country: country,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return location;
  };

  return { getLocation };
};

export default useGeocoder;
