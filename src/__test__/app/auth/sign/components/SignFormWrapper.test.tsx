import { render, screen } from "@/src/__test__/test-utils";
import SignFormWrapper from "@/src/app/auth/sign/components/SignFormWrapper";

function SignForm() {
  return <div data-testid="sign-form"></div>;
}

jest.mock("@/src/app/auth/sign/components/SignForm", () =>
  jest.fn().mockReturnValue(<SignForm />),
);

describe("RegisterFormWrapper", () => {
  it("renders SignForm when loaded", async () => {
    render(<SignFormWrapper />);

    expect(screen.getByTestId("sign-form")).toBeInTheDocument();
  });
});
