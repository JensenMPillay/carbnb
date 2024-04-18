import { render, screen } from "@/src/__test__/test-utils";
import RegisterFormWrapper from "@/src/app/auth/register/components/RegisterFormWrapper";

function RegisterForm() {
  return <div data-testid="register-form"></div>;
}

jest.mock("@/src/app/auth/register/components/RegisterForm", () =>
  jest.fn().mockReturnValue(<RegisterForm />),
);

describe("RegisterFormWrapper", () => {
  it("renders RegisterForm when loaded", async () => {
    render(<RegisterFormWrapper />);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });
});
