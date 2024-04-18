import { render, screen } from "@/src/__test__/test-utils";
import RegisterForm from "@/src/app/auth/register/components/RegisterForm";
import useLoading from "@/src/hooks/useLoading";
import useStore from "@/src/hooks/useStore";
import { REGISTER_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import useUserStore from "@/src/store/useUserStore";
import { MockedProvider } from "@apollo/client/testing";
import user from "@testing-library/user-event";
import { createGraphQLError } from "graphql-yoga";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

jest.mock("next/navigation");
jest.mock("@/src/lib/supabase/supabase-browser-client");
jest.mock("@/src/store/useUserStore");
jest.mock("@/src/hooks/useStore");
jest.mock("@/src/hooks/useLoading");
jest.mock("@/src/lib/notifications/toasters");

jest.mocked(useRouter).mockReturnValue({
  push: jest.fn(),
} as unknown as AppRouterInstance);

jest.mocked(useSearchParams).mockReturnValue({
  get: jest.fn().mockReturnValue("dashboard"),
} as unknown as ReadonlyURLSearchParams);

jest.mocked(useUserStore).mockReturnValue({
  syncUser: jest.fn(),
});

const useStoreMock = jest.mocked(useStore);

const useLoadingMock = jest
  .mocked(useLoading)
  .mockImplementation(() => ({ isLoading: true }));

const successNotifMock = jest.mocked(showNotif);

const errorNotifMock = jest.mocked(showErrorNotif);

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userMock = {
    id: "user-id",
    app_metadata: {},
    aud: "",
    created_at: "",
    user_metadata: {
      name: "Doe",
      full_name: "John Doe",
    },
    email: "john.doe@example.com",
    phone: "0102030405",
  };

  async function submitForm() {
    user.setup();

    await user.type(screen.getByText("Email"), userMock.email);
    await user.type(screen.getByText("Name"), userMock.user_metadata.full_name);
    await user.type(screen.getByText("Phone"), userMock.phone);
    await user.click(screen.getByText("LENDER"));
    await user.click(screen.getByText("Register"));
  }

  it("renders loading screen when is loading", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm />
      </MockedProvider>,
    );

    expect(screen.getByRole("none")).toBeInTheDocument();
  });

  it("renders when loaded", () => {
    useLoadingMock.mockImplementation(() => ({ isLoading: false }));

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm />
      </MockedProvider>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("role")).toBeInTheDocument();
    expect(screen.getByText("RENTER")).toBeInTheDocument();
    expect(screen.getByText("LENDER")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("renders with default values", () => {
    useStoreMock.mockReturnValue(userMock);
    useLoadingMock.mockImplementation(() => ({ isLoading: false }));

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RegisterForm />
      </MockedProvider>,
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
      userMock.email,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      userMock.user_metadata.full_name,
    );
    expect(screen.getByRole("textbox", { name: "Phone" })).toHaveValue(
      userMock.phone,
    );
  });

  it("redirects to callback page after successful registration", async () => {
    console.error = jest.fn();
    useStoreMock.mockReturnValue(undefined);
    useLoadingMock.mockImplementation(() => ({ isLoading: false }));

    const userRegisteredMock = {
      id: "123456",
      email: userMock.email,
      emailVerified: true,
      stripeCustomerId: null,
      stripeVerified: false,
      role: "user",
      name: userMock.user_metadata.full_name,
      phone: userMock.phone,
      image: null,
      createdAt: new Date("2022-04-10T12:00:00Z"),
    };

    const mocks = [
      {
        request: {
          query: REGISTER_USER_MUTATION,
          variables: {
            email: userMock.email,
            name: userMock.user_metadata.full_name,
            phone: userMock.phone,
            role: "LENDER",
          },
        },
        result: { data: userRegisteredMock },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>,
    );

    await submitForm();

    expect(successNotifMock).toHaveBeenCalled();
    expect(useUserStore().syncUser).toHaveBeenCalled();
    expect(useRouter().push).toHaveBeenCalledWith(
      `/api/auth/callback?origin=dashboard`,
    );
  });

  it("renders error after unsuccessful registration", async () => {
    console.error = jest.fn();
    useStoreMock.mockReturnValue(undefined);
    useLoadingMock.mockImplementation(() => ({ isLoading: false }));

    const mocks = [
      {
        request: {
          query: REGISTER_USER_MUTATION,
          variables: {
            email: userMock.email,
            name: userMock.user_metadata.full_name,
            phone: userMock.phone,
            role: "LENDER",
          },
        },
        error: new Error("An error occurred"),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>,
    );

    await submitForm();

    expect(errorNotifMock).toHaveBeenCalled();
  });

  it("renders graphql error after unsuccessful registration", async () => {
    console.error = jest.fn();
    useStoreMock.mockReturnValue(undefined);
    useLoadingMock.mockImplementation(() => ({ isLoading: false }));

    const mocks = [
      {
        request: {
          query: REGISTER_USER_MUTATION,
          variables: {
            email: userMock.email,
            name: userMock.user_metadata.full_name,
            phone: userMock.phone,
            role: "LENDER",
          },
        },
        result: {
          errors: [createGraphQLError("Error!")],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>,
    );

    await submitForm();

    expect(errorNotifMock).toHaveBeenCalled();
  });
});
