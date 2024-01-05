import backgroundImage from "@/public/carbnb-bg.jpg";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import { constructMetadata } from "../lib/utils";

export const metadata = constructMetadata();

export default function Home() {
  return (
    // Background
    <main
      className="relative flex h-[calc(100vh-9rem)] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Gradient Layout  */}
      <div className="absolute inset-0 h-full w-full bg-gradientLayout" />
      {/* Content  */}
      <div className="z-10 flex h-full w-full flex-col items-center">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <SearchForm />
        </div>
      </div>
    </main>
  );
}
