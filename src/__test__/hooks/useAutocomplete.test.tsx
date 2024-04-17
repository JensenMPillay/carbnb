import useAutocomplete from "@/src/hooks/useAutocomplete";
import {
  AutocompleteService,
  AutocompleteSessionToken,
  initialize,
  mockInstances,
} from "@googlemaps/jest-mocks";
import user from "@testing-library/user-event";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { act, render, renderHook, screen } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

const useMapsLibraryMock = jest.mocked(useMapsLibrary);

const useApiIsLoadedMock = jest.mocked(useApiIsLoaded).mockReturnValue(true);

describe("useAutocomplete", () => {
  beforeEach(() => {
    initialize();
  });

  const responseMock = {
    predictions: [
      {
        description: "Paris, France",
        distance_meters: 0,
        matched_substrings: [],
        place_id: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
        structured_formatting: {
          main_text: "Paris",
          main_text_matched_substrings: [],
          secondary_text: "France",
        },
        terms: [{ value: "Paris" }, { value: "France" }],
        types: ["locality", "political"],
      },
      {
        description:
          "Paris Charles de Gaulle Airport (CDG), 95700 Roissy-en-France, France",
        distance_meters: 15000,
        matched_substrings: [{ length: 5, offset: 0 }],
        place_id: "ChIJBXgFOihi5kcRWyCiC4zRn-o",
        structured_formatting: {
          main_text: "Paris Charles de Gaulle Airport (CDG)",
          main_text_matched_substrings: [{ length: 5, offset: 0 }],
          secondary_text: "95700 Roissy-en-France, France",
        },
        terms: [
          { value: "Paris Charles de Gaulle Airport (CDG)" },
          { value: "95700" },
          { value: "Roissy-en-France" },
          { value: "France" },
        ],
        types: ["airport", "point_of_interest", "establishment"],
      },
      {
        description: "Louvre Museum, Rue de Rivoli, Paris, France",
        distance_meters: 2500,
        matched_substrings: [{ length: 6, offset: 0 }],
        place_id: "ChIJ35l7Y3iE5kcRJ4CFfj4y9QY",
        structured_formatting: {
          main_text: "Louvre Museum",
          main_text_matched_substrings: [{ length: 6, offset: 0 }],
          secondary_text: "Rue de Rivoli, Paris, France",
        },
        terms: [
          { value: "Louvre Museum" },
          { value: "Rue de Rivoli" },
          { value: "Paris" },
          { value: "France" },
        ],
        types: ["museum", "point_of_interest", "establishment"],
      },
    ],
    status: "OK",
  };

  const TestComponent = () => {
    const { inputValue, onInputChange, suggestions } = useAutocomplete();
    return (
      <div>
        <input
          value={inputValue}
          onChange={onInputChange}
          data-testid="test-input"
        ></input>
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion.description}</li>
          ))}
        </ul>
      </div>
    );
  };

  it("returns places library if google maps API loaded", async () => {
    const placesLibrary = await google.maps.importLibrary("places");

    useMapsLibraryMock.mockReturnValue(placesLibrary);

    renderHook(useAutocomplete);

    const [autocompleteServiceMock] = mockInstances.get(AutocompleteService);
    const [autocompleteSessionTokenMock] = mockInstances.get(
      AutocompleteSessionToken,
    );

    expect(useApiIsLoaded).toHaveBeenCalled();
    expect(useMapsLibrary).toHaveBeenCalledWith("places");
    expect(autocompleteServiceMock).toBeDefined();
    expect(autocompleteSessionTokenMock).toBeDefined();
  });

  it("returns no predictions when places Library not loaded", async () => {
    useMapsLibraryMock.mockReturnValue(null);

    render(<TestComponent />);

    const [autocompleteServiceMock] = mockInstances.get(AutocompleteService);

    autocompleteServiceMock?.getPlacePredictions.mockResolvedValue(
      responseMock,
    );

    const inputMock = screen.getByTestId("test-input");

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    await user.type(inputMock, "Paris");

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("returns no predictions when google maps API not loaded", async () => {
    const placesLibrary = await google.maps.importLibrary("places");

    const expectedValue = "Paris";

    useMapsLibraryMock.mockReturnValue(placesLibrary);
    useApiIsLoadedMock.mockReturnValueOnce(false);

    render(<TestComponent />);

    const [autocompleteServiceMock] = mockInstances.get(AutocompleteService);

    autocompleteServiceMock?.getPlacePredictions.mockResolvedValue(
      responseMock,
    );

    const inputMock = screen.getByTestId("test-input");

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    await user.type(inputMock, expectedValue);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    const { result } = renderHook(useAutocomplete);

    act(() => result.current.clearSuggestions());

    expect(result.current.suggestions).toHaveLength(0);

    act(() => result.current.setInputValue(expectedValue));

    expect(result.current.inputValue).toBe(expectedValue);
  });

  it("returns predictions", async () => {
    user.setup();

    const placesLibrary = await google.maps.importLibrary("places");

    const expectedLength = 3;

    useMapsLibraryMock.mockReturnValue(placesLibrary);

    render(<TestComponent />);

    const [autocompleteServiceMock] = mockInstances.get(AutocompleteService);

    autocompleteServiceMock?.getPlacePredictions.mockResolvedValue(
      responseMock,
    );

    const inputMock = screen.getByTestId("test-input");

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    await user.type(inputMock, "Paris");

    const predictionListMockAfter = await screen.findAllByRole("listitem");

    expect(predictionListMockAfter).toHaveLength(expectedLength);

    await user.clear(inputMock);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("returns clearSuggestions correctly", async () => {
    user.setup();

    const placesLibrary = await google.maps.importLibrary("places");

    useMapsLibraryMock.mockReturnValue(placesLibrary);

    const { result } = renderHook(useAutocomplete);

    act(() => result.current.clearSuggestions());

    expect(result.current.suggestions).toHaveLength(0);
  });

  it("returns setInputValue correctly", async () => {
    user.setup();

    const placesLibrary = await google.maps.importLibrary("places");

    const expectedValue = "Paris";

    useMapsLibraryMock.mockReturnValue(placesLibrary);

    const { result } = renderHook(useAutocomplete);

    act(() => result.current.setInputValue(expectedValue));

    expect(result.current.inputValue).toBe(expectedValue);
  });
});
