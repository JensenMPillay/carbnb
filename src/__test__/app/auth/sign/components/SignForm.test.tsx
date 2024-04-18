import { render, screen } from "@/src/__test__/test-utils";
import SignForm from "@/src/app/auth/sign/components/SignForm";
import useLoading from "@/src/hooks/useLoading";
import supabaseBrowserClient from "@/src/lib/supabase/supabase-browser-client";
import user from "@testing-library/user-event";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

jest.mock("next/navigation");
jest.mock("@/src/lib/supabase/supabase-browser-client");
jest.mock("@/src/hooks/useLoading");

jest.mocked(useRouter).mockReturnValue({
  push: jest.fn(),
} as unknown as AppRouterInstance);

jest.mocked(useSearchParams).mockReturnValue({
  get: jest.fn().mockReturnValue("dashboard"),
} as unknown as ReadonlyURLSearchParams);

const signInWithPasswordMock = jest.mocked(
  supabaseBrowserClient.auth.signInWithPassword,
);

const onAuthStateChangeMock = jest
  .mocked(supabaseBrowserClient.auth.onAuthStateChange)
  .mockReturnValue({
    data: {
      subscription: {
        unsubscribe: jest.fn(),
        callback: jest.fn(),
        id: "subscription-id-test",
      },
    },
  });

const useLoadingMock = jest
  .mocked(useLoading)
  .mockImplementation(() => ({ isLoading: true }));

describe("SignForm", () => {
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
    },
    email: "john.doe@example.com",
  };
  const sessionMock = {
    provider_token: "mock_provider_token",
    provider_refresh_token: "mock_provider_refresh_token",
    access_token: "mock_access_token",
    refresh_token: "mock_refresh_token",
    expires_in: 3600,
    expires_at: Date.now() + 3600 * 1000,
    token_type: "Bearer",
    user: userMock,
  };

  it("renders loading screen when is loading", () => {
    render(<SignForm />);

    expect(screen.getByRole("none")).toBeInTheDocument();
  });

  it("renders Auth component when loaded", () => {
    useLoadingMock.mockImplementation(() => ({ isLoading: false }));

    render(<SignForm />);

    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Your Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("redirects to callback page after successful authentication", async () => {
    user.setup();

    useLoadingMock.mockImplementation(() => ({ isLoading: false }));
    signInWithPasswordMock.mockResolvedValue({
      data: {
        user: userMock,
        session: sessionMock,
      },
      error: null,
    });

    render(<SignForm />);

    await user.type(screen.getByText("Email address"), "test@gmail.com");
    await user.type(screen.getByText("Your Password"), "testtest123!");
    await user.click(screen.getByText("Sign in"));

    expect(signInWithPasswordMock).toHaveBeenCalled();
    expect(onAuthStateChangeMock).toHaveBeenCalledTimes(2);
    expect(await screen.findByText("Sign in")).toBeInTheDocument();
  });
});
