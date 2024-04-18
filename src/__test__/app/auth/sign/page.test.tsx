import { render, screen } from "@/src/__test__/test-utils";
import Sign from "@/src/app/auth/sign/page";

function SignFormWrapper() {
  return <div data-testid="sign-form"></div>;
}

jest.mock("@/src/app/auth/sign/components/SignFormWrapper", () =>
  jest.fn().mockReturnValue(<SignFormWrapper />),
);

describe("Register", () => {
  it("renders", async () => {
    render(<Sign />);
  });

  it("renders with Sign Card", async () => {
    render(<Sign />);

    expect(
      screen.getByText("Join us or sign in to your account"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("sign-form")).toBeInTheDocument();
  });
});
