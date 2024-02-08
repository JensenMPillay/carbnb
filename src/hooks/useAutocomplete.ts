"use client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

// type UseAutocompleteProps = {
//   input: HTMLInputElement | null;
// };

const useAutocomplete = () => {
  // Google Maps Libraries
  const placesLibrary: google.maps.PlacesLibrary | null =
    useMapsLibrary("places");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  // Service SessionToken
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  // Autocomplete Service
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.AutocompleteService | null>(null);

  // Input & Suggestions States
  const [inputValue, setInputValue] = useState<string>("");

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  // Component Loaded => Instance Libraries
  useEffect(() => {
    if (IsLoaded && placesLibrary) {
      setAutocomplete(new placesLibrary.AutocompleteService());
      setSessionToken(new placesLibrary.AutocompleteSessionToken());
    }

    // Instances Clean
    return () => {
      setAutocomplete(null);
    };
  }, [IsLoaded, placesLibrary]);

  // Callback Handle Suggestions
  const updateSuggestions = useCallback(
    async (inputValue: string | null) => {
      if (!autocomplete || !inputValue) {
        setSuggestions([]);
        return;
      }

      const request: google.maps.places.AutocompletionRequest = {
        componentRestrictions: { country: "fr" },
        input: inputValue,
      };
      const response: google.maps.places.AutocompletePrediction[] = (
        await autocomplete.getPlacePredictions(request)
      ).predictions;

      setSuggestions(response);
    },
    [autocomplete],
  );

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      // Sync Input Value
      setInputValue(value);
      // Sync Suggestions Prediction
      updateSuggestions(value);
    },
    [updateSuggestions],
  );

  const clearSuggestions: () => void = () => {
    setSuggestions([]);
    // Init New Token
    if (placesLibrary)
      setSessionToken(new placesLibrary.AutocompleteSessionToken());
  };

  // Service Not Working
  if (!autocomplete)
    return {
      inputValue: "",
      setInputValue: () => {},
      onInputChange: () => {},
      suggestions: [],
      clearSuggestions: () => {},
    };

  return {
    inputValue,
    setInputValue,
    onInputChange,
    suggestions,
    clearSuggestions,
  };
};

export default useAutocomplete;
