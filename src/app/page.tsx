import Header from "../components/Header";
import SearchFormWrapper from "../components/SearchFormWrapper";
import {
  RandomSVGComponent,
  SVGDeal,
  SVGGoodbye,
  SVGSearch,
  SVGValidation,
} from "../components/VectorImages";
import { constructMetadata } from "../lib/utils";

import type { Metadata } from "next";

/**
 * Constructs metadata for the Home page.
 */
export const metadata: Metadata = constructMetadata();

/**
 * Home component renders the main content of the home page.
 */
export default function Home() {
  return (
    // Background
    <main className="flex min-h-[calc(100vh-9rem)] flex-col bg-cover bg-center md:flex-row">
      <Header />
      <section className="flex max-h-fit w-full flex-col items-center justify-center p-2 md:w-2/3">
        {/* <RandomSVGComponent
          svgArray={[SVGDeal, SVGGoodbye, SVGSearch, SVGValidation]}
          className="w-3/4 xl:w-1/2"
        /> */}
        <RandomSVGComponent>
          <SVGDeal className="w-3/4 xl:w-1/2" />
          <SVGGoodbye className="w-3/4 xl:w-1/2" />
          <SVGSearch className="w-3/4 xl:w-1/2" />
          <SVGValidation className="w-3/4 xl:w-1/2" />
        </RandomSVGComponent>
        <SearchFormWrapper />
      </section>
    </main>
  );
}
