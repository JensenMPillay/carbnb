import Dashboard from "@/src/app/dashboard/page";
import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { render } from "../../test-utils";

function RegisterFormWrapper() {
  return <div data-testid="register-form"></div>;
}

jest.mock("@/src/app/auth/register/components/RegisterFormWrapper", () =>
  jest.fn().mockReturnValue(<RegisterFormWrapper />),
);
jest.mock("next/navigation");
jest.mock("next/headers");
jest.mock("@/src/lib/supabase/get-supabase-server-client");

const redirectMock = jest.mocked(redirect);

jest.mocked(cookies);

const getUserMock = jest.fn();

jest.mocked(getSupabaseServerClient).mockReturnValue({
  auth: {
    getUser: getUserMock.mockReturnValue({ data: { user: null }, error: null }),
  },
} as unknown as SupabaseClient);

describe("Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userMock = {
    id: "user-id",
    app_metadata: {},
    aud: "",
    created_at: "",
    user_metadata: {
      name: "John Doe",
      isRegistered: true,
    },
    email: "john.doe@example.com",
  };

  it("renders", async () => {
    getUserMock.mockReturnValue({ data: { user: userMock }, error: null });

    render(await Dashboard());
  });

  it("redirects to profile page", async () => {
    getUserMock.mockReturnValue({ data: { user: userMock }, error: null });

    render(await Dashboard());

    expect(redirectMock).toHaveBeenCalledWith("/dashboard/profile");
  });

  it("redirects to Sign Page if no user", async () => {
    getUserMock.mockReturnValue({ data: { user: null }, error: null });

    render(await Dashboard());

    expect(redirectMock).toHaveBeenCalledWith("/auth/sign?origin=dashboard");
  });

  it("redirects to Sign Page if error", async () => {
    getUserMock.mockReturnValue({
      data: { user: userMock },
      error: new Error(),
    });

    render(await Dashboard());

    expect(redirectMock).toHaveBeenCalledWith("/auth/sign?origin=dashboard");
  });

  it("redirects to Sign Page if user has not been registered yet", async () => {
    getUserMock.mockReturnValue({
      data: {
        user: {
          ...userMock,
          user_metadata: { ...userMock.user_metadata, isRegistered: false },
        },
      },
      error: null,
    });

    render(await Dashboard());

    expect(redirectMock).toHaveBeenCalledWith("/auth/sign?origin=dashboard");
  });
});
