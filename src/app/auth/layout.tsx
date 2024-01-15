import { RandomSVGComponent } from "@/src/components/VectorImages";
import { Card } from "@/src/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main
    <main className="flex min-h-[calc(100vh-9rem)] flex-row">
      {/* Image  */}
      <aside className="relative hidden h-auto flex-1 md:flex">
        <RandomSVGComponent className="w-full" />
      </aside>
      <section className="min-h-fit flex-1 px-8 md:px-10 lg:px-12">
        <Card className="min-h-fit py-4 md:py-8 lg:py-12">{children}</Card>
      </section>
    </main>
  );
}
