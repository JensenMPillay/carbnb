import { Car } from "@prisma/client";

type SearchMapProps = {
  cars: Car[];
};

const SearchMap = ({ cars }: SearchMapProps) => {
  return <div>SearchMap</div>;
};

export default SearchMap;
