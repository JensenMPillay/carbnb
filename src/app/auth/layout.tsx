import { RandomSVGComponent } from "@/src/components/VectorImages";
import { Card } from "@/src/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main
    <main className="flex h-[calc(100vh-9rem)] flex-row overflow-auto">
      {/* Image  */}
      <div className="relative hidden h-auto flex-1 md:flex">
        <RandomSVGComponent className="w-full" />
      </div>
      <div className="max-h-fit flex-1 px-8 md:px-10 lg:px-12">
        <Card className="h-full overflow-auto py-4 md:py-8 lg:py-12">
          {children}
        </Card>
      </div>
    </main>
  );
}
