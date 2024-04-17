import AddressFormField from "@/src/components/AddressFormField";
import { Form } from "@/src/components/ui/form";
import {
  AutocompleteService,
  initialize,
  mockInstances,
} from "@googlemaps/jest-mocks";
import user from "@testing-library/user-event";
import { useApiIsLoaded, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useForm } from "react-hook-form";
import { render, screen } from "../test-utils";

jest.mock("@vis.gl/react-google-maps");

const useMapsLibraryMock = jest.mocked(useMapsLibrary);

jest.mocked(useApiIsLoaded).mockReturnValue(true);

describe("AddressFormField", () => {
  beforeEach(() => {
    initialize();
    jest.clearAllMocks();
  });

  const defaultValue = {
    id: "ChIJLU7jZClu5kcR4PcOOO6p3I0",
    description: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
  };

  const TestComponent = ({
    defaultValue,
  }: {
    defaultValue?: { id: string; description: string } | undefined;
  }) => {
    const testForm = useForm({
      defaultValues: {
        location: {
          id: "",
          description: "",
        },
      },
    });

    return (
      <Form {...testForm}>
        <form id="testForm">
          <AddressFormField
            form={testForm}
            fieldName="location"
            defaultValue={defaultValue}
          />
        </form>
      </Form>
    );
  };

  it("renders", () => {
    render(<TestComponent />);
  });

  it("renders with correct label and input", () => {
    render(<TestComponent />);

    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search address..."),
    ).toBeInTheDocument();
  });

  it("renders with no default value", () => {
    render(<TestComponent />);

    const input = screen.getByPlaceholderText("Search address...");

    expect(input).toHaveValue("");
  });

  it("renders with default value", () => {
    render(<TestComponent defaultValue={defaultValue} />);

    const input = screen.getByPlaceholderText("Search address...");

    expect(input).toHaveValue(defaultValue.description);
  });

  it("renders no suggestions", () => {
    render(<TestComponent />);
  });

  it("renders suggestions and update value when suggestion clicked", async () => {
    user.setup();

    const placesLibrary = await google.maps.importLibrary("places");

    useMapsLibraryMock.mockReturnValue(placesLibrary);

    render(<TestComponent />);

    const responseMock = {
      predictions: [
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

    const expectedValue = "Louvre Museum, Rue de Rivoli, Paris, France";

    render(<TestComponent />);

    const [autocompleteServiceMock] = mockInstances.get(AutocompleteService);

    autocompleteServiceMock?.getPlacePredictions.mockResolvedValue(
      responseMock,
    );

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    const inputs = screen.getAllByPlaceholderText("Search address...");

    if (inputs[0] != undefined) await user.type(inputs[0], "Paris");

    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.click(
      await screen.findByRole("option", {
        name: expectedValue,
      }),
    );
    const newInputs = screen.getAllByPlaceholderText("Search address...");

    if (newInputs[0] != undefined)
      expect(newInputs[0]).toHaveValue(expectedValue);
  });
});
