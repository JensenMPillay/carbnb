"use client";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

/**
 * Custom hook for accessing Autocomplete variables and functions from the Google Maps Places Library.
 * This hook provides functionality to interact with the Autocomplete feature of Google Maps Places Library.
 * @returns {object} - An object containing Autocomplete variables and functions.
 * @property {string} inputValue - The current input value of the Autocomplete field.
 * @property {function} setInputValue - A function to set the input value of the Autocomplete field.
 * @property {function} onInputChange - A function to handle input change events in the Autocomplete field.
 * @property {Array<google.maps.places.AutocompletePrediction>} suggestions - An array of Autocomplete predictions based on the input value.
 * @property {function} clearSuggestions - A function to clear the Autocomplete suggestions.
 * @example
 * const {
 *   inputValue,
 *   setInputValue,
 *   onInputChange,
 *   suggestions,
 *   clearSuggestions,
 * } = useAutocomplete();
 */
const useAutocomplete = () => {
  // Google Maps Libraries
  const placesLibrary: google.maps.PlacesLibrary | null =
    useMapsLibrary("places");

  // Google Maps Loading State
  const IsLoaded = useApiIsLoaded();

  // Instances States
  // Service SessionToken
  const [, setSessionToken] =
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

  /**
   * Updates the Autocomplete suggestions based on the provided input value.
   * @param {string | null} inputValue - The input value to use for fetching Autocomplete predictions.
   * @returns {void}
   */
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

  /**
   * Handles input change events in the Autocomplete field.
   * @param {ChangeEvent<HTMLInputElement>} event - The input change event.
   * @returns {void}
   */
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

  /**
   * Clears the Autocomplete suggestions and resets the Autocomplete session token.
   * @returns {void}
   */
  const clearSuggestions: () => void = useCallback(() => {
    setSuggestions([]);
    // Init New Token
    if (placesLibrary)
      setSessionToken(new placesLibrary.AutocompleteSessionToken());
  }, [placesLibrary]);

  // Service Not Working
  if (!autocomplete)
    return {
      inputValue,
      setInputValue,
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
