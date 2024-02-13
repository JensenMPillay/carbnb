import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CarData } from "../@types/queries.types";

type SearchStore = {
  // Available Cars Filtered
  cars: CarData[] | null;
  setCars: (cars: CarData[] | null) => void;
  //   Car Selected
  carSelected: CarData | null;
  setCarSelected: (car: CarData | null) => void;
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
