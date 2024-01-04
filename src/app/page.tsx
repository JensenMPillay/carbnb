import backgroundImage from "@/public/carbnb-bg.jpg";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";

export default function Home() {
  return (
    // Background
    <main
      className="relative flex h-[calc(100vh-9rem)] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage.src})` }}
    >
      {/* Gradient Layout  */}
      <div className="bg-gradientLayout absolute inset-0 h-full w-full" />
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
