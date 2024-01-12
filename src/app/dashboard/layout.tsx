import { Card } from "@/src/components/ui/card";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main
    <main className="flex h-[calc(100vh-9rem)] flex-row overflow-auto">
      <section className="max-h-fit w-full flex-1 px-8 md:px-10 lg:px-12">
        <Card className="h-full flex-1 overflow-auto py-4">{children}</Card>
      </section>
    </main>
  );
}
