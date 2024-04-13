import useLoading from "@/src/hooks/useLoading";
import { renderHook } from "@testing-library/react";

describe("useLoading", () => {
  it("should return isLoading as false when mounted", () => {
    const { result } = renderHook(useLoading);

    expect(result.current.isLoading).toBe(false);
  });
});
