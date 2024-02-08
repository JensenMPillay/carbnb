import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { constructMetadata } from "@/src/lib/utils";

export const metadata = constructMetadata({
  title: "Carbnb | Search",
  description: "Search Your Ideal Car",
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main
    <main className="flex min-h-[calc(100vh-9rem)] flex-row">
      <section className="min-h-fit w-full flex-1 px-8 md:px-10 lg:px-12">
        <Card className="min-h-fit flex-1 py-4">
          <CardHeader className="flex w-full p-2 md:p-3 lg:p-4">
            <CardTitle className="text-xl font-bold">
              Discover Your Ideal Car
            </CardTitle>
            <CardDescription>
              Optimize Your Search Experience with Filters
            </CardDescription>
          </CardHeader>
          <Separator orientation="horizontal" />
          <CardContent className="flex flex-1 flex-col p-0">
            {children}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}