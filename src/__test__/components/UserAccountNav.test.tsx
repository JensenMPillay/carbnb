import UserAccountNav from "@/src/components/UserAccountNav";
import supabaseBrowserClient from "@/src/lib/supabase/supabase-browser-client";
import useUserStore from "@/src/store/useUserStore";
import user from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { render, screen, waitFor } from "../test-utils";

jest.mock("next/navigation");
jest.mock("@/src/lib/supabase/supabase-browser-client");
jest.mock("@/src/store/useUserStore");

const pushMock = jest.fn();
const refreshMock = jest.fn();

// useRouter Mock
jest.mocked(useRouter).mockReturnValue({
  back: jest.fn(),
  forward: jest.fn(),
  push: pushMock,
  replace: jest.fn(),
  refresh: refreshMock,
  prefetch: jest.fn(),
});

// supabaseBrowserClient Mock
const signOutMock = jest
  .mocked(supabaseBrowserClient.auth.signOut)
  .mockResolvedValue({
    error: null,
  });

const syncUserMock = jest.fn();

// useUserStore Mock
jest.mocked(useUserStore).mockReturnValue({
  syncUser: syncUserMock,
});

const mockedUser = {
  id: "user-id",
  app_metadata: {},
  aud: "",
  created_at: "",
  user_metadata: {
    name: "John Doe",
  },
  email: "john.doe@example.com",
};

describe("UserAccountNav", () => {
  it("renders UserAccountNav component button when user doesn't have an  avatar", () => {
    render(<UserAccountNav user={mockedUser} />);

    const iconButton = screen.getByRole("button", { name: /avatar/i });

    expect(iconButton).toBeInTheDocument();
  });

  it("renders UserAccountNav component button when user has an avatar", () => {
    const mockedUserWithAvatar = {
      ...mockedUser,
      user_metadata: {
        ...mockedUser.user_metadata,
        image: "/path/to/avatar.png",
      },
    };

    render(<UserAccountNav user={mockedUserWithAvatar} />);

    const avatarButton = screen.getByRole("button", { name: /picture/i });

    expect(avatarButton).toBeInTheDocument();
  });

  it("renders UserAccountNav component with user information", async () => {
    user.setup();

    render(<UserAccountNav user={mockedUser} />);

    const iconButton = screen.getByRole("button", { name: /avatar/i });
    await user.click(iconButton);

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
  });

  it("renders Sign Out button and calls signOut function when clicked", async () => {
    user.setup();

    render(<UserAccountNav user={mockedUser} />);

    const iconButton = screen.getByRole("button", { name: /avatar/i });
    await user.click(iconButton);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });

    expect(signOutButton).toBeInTheDocument();

    await user.click(signOutButton);

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(syncUserMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledTimes(1);
    });
  });
});
