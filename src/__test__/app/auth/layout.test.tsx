import AuthLayout from "@/src/app/auth/layout";
import { render, screen } from "../../test-utils";

describe("AuthLayout", () => {
  it("renders", () => {
    render(
      <AuthLayout>
        <div>Auth Component</div>
      </AuthLayout>,
    );
  });

  it("renders SVG and Auth Component", () => {
    render(
      <AuthLayout>
        <div>Auth Component</div>
      </AuthLayout>,
    );

    expect(screen.getByTitle(/SVG/)).toBeInTheDocument();
    expect(screen.getByText("Auth Component")).toBeInTheDocument();
  });
});
