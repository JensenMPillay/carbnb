import SearchFormWrapper from "@/src/components/SearchFormWrapper";
import { initialize } from "@googlemaps/jest-mocks";
import { useRouter } from "next/navigation";
import { render } from "../test-utils";

jest.mock("next/navigation");

jest.mocked(useRouter);

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
