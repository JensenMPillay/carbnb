import SearchCars from "./components/SearchCars";

type Props = {};

function Search({}: Props) {
  return (
    <div className="grid grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
      <SearchCars />
    </div>
  );
}

export default Search;
