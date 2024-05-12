import DashboardLayout from "@/src/app/dashboard/layout";
import { usePathname, useRouter } from "next/navigation";
import { render, screen } from "../../test-utils";

jest.mock("next/navigation");

jest.mocked(useRouter);
jest.mocked(usePathname);

describe("DashboardLayout", () => {
  it("renders", () => {
    render(
      <DashboardLayout>
        <div>Dashboard Component</div>
      </DashboardLayout>,
    );
  });

  it("renders Title and Tabs List", () => {
    render(
      <DashboardLayout>
        <div>Dashboard Component</div>
      </DashboardLayout>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Renter Space")).toBeInTheDocument();
    expect(screen.getByText("Lender Space")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Component")).toBeInTheDocument();
  });
});
