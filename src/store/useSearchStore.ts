import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CarQuery } from "../@types/queries.types";

type SearchStore = {
  // Available Cars Filtered
  cars: CarQuery[] | null;
  setCars: (cars: CarQuery[] | null) => void;
  //   Car Selected
  carSelected: CarQuery | null;
  setCarSelected: (car: CarQuery | null) => void;
};

const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      // Data
      cars: null,
      carSelected: null,
      // Setter
      setCars: (cars) => set({ cars: cars }),
      setCarSelected: (car) => set({ carSelected: car }),
    }),
    // For Persisting Global Data State (Local Storage)
    {
      name: "cars", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useSearchStore;
