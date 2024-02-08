"use client";
import CarCard from "@/src/components/CarCard";
import { Car } from "@prisma/client";

type SearchCarsProps = {
  cars: Car[];
};

const SearchCars = ({ cars }: SearchCarsProps) => {
  return (
    <div className="grid grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
      {cars.map((car: Car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
};

export default SearchCars;
