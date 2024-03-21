import { FormattedLocation } from "@/src/hooks/useGeocoder";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CarQuery } from "../@types/queries.types";
import { SearchFormSchemaType } from "../lib/schemas/SearchFormSchema";
import { CarFilterSchemaType } from "../lib/schemas/car/CarSchema";

type SearchStore = {
  // Form Values
  searchValues: {
    formValues: SearchFormSchemaType;
    formattedLocation: FormattedLocation;
  } | null;
  setSearchValues: ({
    locationId,
    startDate,
    endDate,
    formattedLocation,
  }: {
    locationId: string;
    startDate: string;
    endDate: string;
    formattedLocation: { description: string; lat: number; lng: number };
  }) => void;
  // Available Cars
  cars: CarQuery[] | null;
  setCars: (cars: CarQuery[] | null) => void;
  // Car Selected
  carSelected: CarQuery | null;
  setCarSelected: (car: CarQuery | null) => void;
  // Filters
  filters: CarFilterSchemaType | null;
  setFilters: (filters: CarFilterSchemaType) => void;
  // Filtered Cars
  filteredCars: CarQuery[] | null;
  setFilteredCars: (cars: CarQuery[] | null) => void;
};

/**
 * Search store managing search-related state in the application.
 */
const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      // Data
      searchValues: null,
      cars: null,
      carSelected: null,
      filters: null,
      filteredCars: null,
      // Setter
      setSearchValues: (values) => {
        const { locationId, startDate, endDate, formattedLocation } = values;
        set({
          searchValues: {
            formValues: {
              location: {
                id: locationId,
                description: formattedLocation.description,
              },
              date: {
                from: new Date(startDate),
                to: new Date(endDate),
              },
            },
            formattedLocation: formattedLocation,
          },
        });
      },
      setCars: (cars) => set({ cars: cars }),
      setCarSelected: (car) => set({ carSelected: car }),
      setFilters: (filters) => set({ filters: filters }),
      setFilteredCars: (cars) => set({ filteredCars: cars, carSelected: null }),
    }),
    // For Persisting Global Data State (Local Storage)
    {
      name: "search", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useSearchStore;
