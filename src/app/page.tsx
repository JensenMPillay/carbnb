import Header from "../components/Header";
import SearchFormWrapper from "../components/SearchFormWrapper";
import { RandomSVGComponent } from "../components/VectorImages";
import { constructMetadata } from "../lib/utils";

export const metadata = constructMetadata();

export default function Home() {
  return (
    // Background
    <main className="flex min-h-[calc(100vh-9rem)] flex-col bg-cover bg-center md:flex-row">
      <Header />
      <section className="flex max-h-fit w-full flex-col items-center justify-center p-2 md:w-2/3">
        <RandomSVGComponent className="w-3/4 xl:w-1/2" />
        <SearchFormWrapper />
      </section>
    </main>
  );
}
