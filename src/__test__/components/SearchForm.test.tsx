import SearchForm from "@/src/components/SearchForm";
import useStore from "@/src/hooks/useStore";
import user from "@testing-library/user-event";
import { format } from "date-fns";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { render, screen } from "../test-utils";

jest.mock("next/navigation");
jest.mock("@/src/hooks/useStore");

const useStoreMock = jest.mocked(useStore);

jest.mocked(useRouter).mockReturnValue({
  push: jest.fn(),
} as unknown as AppRouterInstance);

jest.mocked(usePathname).mockReturnValue("/search");

describe("SearchForm", () => {
  const defaultValuesMock = {
    location: {
      id: "ChIJLU7jZClu5kcR4PcOOO6p3I0",
      description:
        "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    },
    date: {
      from: new Date("2030-06-15"),
      to: new Date("2030-06-22"),
    },
  };
  it("renders", () => {
    render(<SearchForm />);
  });

  it("renders with inputs and buttons", () => {
    render(<SearchForm />);

    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("renders with default values", () => {
    useStoreMock.mockReturnValue(defaultValuesMock);

    render(<SearchForm />);

    expect(screen.getByLabelText(/Address/i)).toHaveValue(
      defaultValuesMock.location.description,
    );
    expect(screen.getByText(format(defaultValuesMock.date.from, "PPP")));
    expect(screen.getByText(format(defaultValuesMock.date.to, "PPP")));
  });

  it("submits formData and redirect to /search with URL Params", async () => {
    user.setup();

    useStoreMock.mockReturnValue(defaultValuesMock);

    const urlParamsMock = new URLSearchParams({
      locationId: defaultValuesMock.location.id,
      startDate: defaultValuesMock.date.from.toDateString(),
      endDate: defaultValuesMock.date.to.toDateString(),
    });

    render(<SearchForm />);

    await user.click(screen.getByRole("button", { name: "" }));

    expect(useRouter().push).toHaveBeenCalledWith(`/search?${urlParamsMock}`, {
      scroll: false,
    });
  });
});
