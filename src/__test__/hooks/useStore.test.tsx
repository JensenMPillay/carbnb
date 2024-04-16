import useStore from "@/src/hooks/useStore";
import { render, screen } from "@testing-library/react";

const TestComponent: React.FC<{
  store: (callback: (state: unknown) => unknown) => unknown;
  callback: (state: unknown) => unknown;
}> = ({ store, callback }) => {
  const data = useStore(store, callback) as string;

  return <div>{data}</div>;
};

const mockCallback = jest.fn();

describe("useStore", () => {
  it("returns undefined if store does not provide data", () => {
    const mockStore = jest.fn(() => undefined);

    render(<TestComponent store={mockStore} callback={mockCallback} />);

    expect(screen.queryByText(/data/i)).not.toBeInTheDocument();
  });

  it("returns data from store", () => {
    const testData = "test data";

    const mockStore = jest.fn(() => testData);

    render(<TestComponent store={mockStore} callback={mockCallback} />);

    expect(screen.getByText(/test data/i)).toBeInTheDocument();
  });
});