"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

/**
 * Dashboard layout component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    // Main
    <main className="flex min-h-[calc(100vh-9rem)] flex-row">
      <section className="min-h-fit w-full flex-1 px-8 md:px-10 lg:px-12">
        <Card className="min-h-fit flex-1 bg-card/75 py-4">
          <Tabs
            className="flex h-full w-full flex-col"
            value={pathname}
            onValueChange={(value) => {
              router.push(value);
            }}
            orientation="horizontal"
          >
            <CardHeader className="flex w-full p-2 md:p-3 lg:p-4">
              <CardTitle className="text-xl font-bold">Dashboard</CardTitle>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="flex flex-1 flex-col p-0">
              <TabsList className="flex h-fit w-full justify-evenly rounded-none">
                <TabsTrigger value="/dashboard/profile" className="capitalize">
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="/dashboard/renterspace"
                  className="capitalize"
                >
                  Renter Space
                </TabsTrigger>
                <TabsTrigger
                  value="/dashboard/lenderspace"
                  className="capitalize"
                >
                  Lender Space
                </TabsTrigger>
              </TabsList>
              {children}
            </CardContent>
          </Tabs>
        </Card>
      </section>
    </main>
  );
}
