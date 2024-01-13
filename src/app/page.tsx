import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import { RandomSVGComponent } from "../components/VectorImages";
import { constructMetadata } from "../lib/utils";

export const metadata = constructMetadata();

export default function Home() {
  return (
    // Background
    <main className="flex h-[calc(100vh-9rem)] flex-col bg-cover bg-center md:flex-row">
      <Header />
      <section className="flex max-h-fit w-full flex-1 flex-col items-center justify-center">
        <SearchForm />
        <RandomSVGComponent className="w-3/4 lg:w-1/2" />
      </section>
    </main>
  );
}
