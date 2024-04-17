import SearchFormWrapper from "@/src/components/SearchFormWrapper";
import { initialize } from "@googlemaps/jest-mocks";
import { useRouter } from "next/navigation";
import { render } from "../test-utils";

jest.mock("next/navigation");

jest.mocked(useRouter).mockReturnValue({
  back: jest.fn(),
  forward: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
});

describe("SearchForm", () => {
  beforeEach(() => {
    initialize();
  });

  it("renders", () => {
    // APIProvider Warning Behavior
    console.error = jest.fn();
    render(<SearchFormWrapper />);
  });
});
