import Navbar from "@/src/components/Navbar";
import useStore from "@/src/hooks/useStore";
import user from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { render, screen } from "../test-utils";

jest.mock("next/navigation");
jest.mock("@/src/hooks/useStore");

const usePathnameMock = jest.mocked(usePathname);

const useStoreMock = jest.mocked(useStore);

describe("Navbar", () => {
  it("renders", () => {
    usePathnameMock.mockReturnValue("/");
    useStoreMock.mockReturnValue(null);
    render(<Navbar />);

    expect(usePathnameMock).toHaveBeenCalled();
    expect(useStoreMock).toHaveBeenCalled();
  });

  it("renders logo", () => {
    usePathnameMock.mockReturnValue("/");

    render(<Navbar />);

    const logo = screen.getByAltText(/logo/);

    expect(logo).toBeInTheDocument();
  });

  it("renders toggle theme button", () => {
    usePathnameMock.mockReturnValue("/");

    render(<Navbar />);

    const toggleThemeButton = screen.getByRole("button", {
      name: /toggle theme/i,
    });

    expect(toggleThemeButton).toBeInTheDocument();
  });

  it("renders sign-in link", () => {
    usePathnameMock.mockReturnValue("/");

    render(<Navbar />);

    const signInLink = screen.getByRole("link", { name: /sign in/i });

    expect(signInLink).toBeInTheDocument();
  });

  it("renders correct origin link", () => {
    usePathnameMock.mockReturnValue("/dashboard");

    render(<Navbar />);

    const signInLink = screen.getByRole("link", { name: /sign in/i });

    expect(signInLink).toHaveAttribute(
      "href",
      `/auth/sign?origin=${usePathnameMock().slice(1)}`,
    );
  });

  it("renders correct origin link when /.../.../", () => {
    usePathnameMock.mockReturnValue("/dashboard/lenderspace");

    render(<Navbar />);

    const signInLink = screen.getByRole("link", { name: /sign in/i });

    expect(signInLink).toHaveAttribute("href", `/auth/sign`);
  });

  it("renders correct user avatar if logged", () => {
    usePathnameMock.mockReturnValue("/");
    const userMock = {
      id: "user-id",
      app_metadata: {},
      aud: "",
      created_at: "",
      user_metadata: {
        name: "John Doe",
        isRegistered: true,
        image: "/path/to/avatar.png",
      },
      email: "john.doe@example.com",
    };
    useStoreMock.mockReturnValue(userMock);

    render(<Navbar />);

    const avatarButton = screen.getByRole("button", { name: /picture/i });

    expect(avatarButton).toBeInTheDocument();
  });

  it("toggles theme when clicking on toggle button", async () => {
    user.setup();
    usePathnameMock.mockReturnValue("/");

    render(<Navbar />);

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    await user.click(toggleButton);

    const themeLogo = screen.getByRole("img", { name: /white/i });

    expect(themeLogo).toBeInTheDocument();
  });
});
