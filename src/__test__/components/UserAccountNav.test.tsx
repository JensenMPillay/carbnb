import UserAccountNav from "@/src/components/UserAccountNav";
import supabaseBrowserClient from "@/src/lib/supabase/supabase-browser-client";
import useUserStore from "@/src/store/useUserStore";
import user from "@testing-library/user-event";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { render, screen, waitFor } from "../test-utils";

jest.mock("next/navigation");
jest.mock("@/src/lib/supabase/supabase-browser-client");
jest.mock("@/src/store/useUserStore");

jest.mocked(useRouter).mockReturnValue({
  push: jest.fn(),
  refresh: jest.fn(),
} as unknown as AppRouterInstance);

const signOutMock = jest
  .mocked(supabaseBrowserClient.auth.signOut)
  .mockResolvedValue({
    error: null,
  });

jest.mocked(useUserStore).mockReturnValue({
  syncUser: jest.fn(),
});

describe("UserAccountNav", () => {
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

  it("renders", () => {
    render(<UserAccountNav user={userMock} />);
  });

  it("renders UserAccountNav component button when user doesn't have an  avatar", () => {
    render(<UserAccountNav user={userMock} />);

    const iconButton = screen.getByRole("button", { name: /avatar/i });

    expect(iconButton).toBeInTheDocument();
  });

  it("renders UserAccountNav component button when user has an avatar", () => {
    const userWithAvatarMock = {
      ...userMock,
      user_metadata: {
        ...userMock.user_metadata,
        image: "/path/to/avatar.png",
      },
    };

    render(<UserAccountNav user={userWithAvatarMock} />);

    const avatarButton = screen.getByRole("button", { name: /picture/i });

    expect(avatarButton).toBeInTheDocument();
  });

  it("renders UserAccountNav component with user information", async () => {
    user.setup();

    render(<UserAccountNav user={userMock} />);

    const iconButton = screen.getByRole("button", { name: /avatar/i });
    await user.click(iconButton);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
  });

  it("renders Sign Out button and calls signOut function when clicked", async () => {
    user.setup();

    render(<UserAccountNav user={userMock} />);

    const iconButton = screen.getByRole("button", { name: /avatar/i });
    await user.click(iconButton);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });

    expect(signOutButton).toBeInTheDocument();

    await user.click(signOutButton);

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(useUserStore().syncUser).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(useRouter().refresh).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledTimes(1);
    });
  });
});
