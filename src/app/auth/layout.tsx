import {
  RandomSVGComponent,
  SVGDeal,
  SVGGoodbye,
  SVGSearch,
  SVGValidation,
} from "@/src/components/VectorImages";
import { Card } from "@/src/components/ui/card";

/**
 * Auth layout component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 */
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
        {/* <RandomSVGComponent
          svgArray={[SVGDeal, SVGGoodbye, SVGSearch, SVGValidation]}
          className="w-full"
        > */}
        <RandomSVGComponent>
          <SVGDeal className="w-full" />
          <SVGGoodbye className="w-full" />
          <SVGSearch className="w-full" />
          <SVGValidation className="w-full" />
        </RandomSVGComponent>
      </aside>
      <section className="min-h-fit flex-1 px-8 md:px-10 lg:px-12">
        <Card className="min-h-fit bg-card/75 py-4 md:py-8 lg:py-12">
          {children}
        </Card>
      </section>
    </main>
  );
}
