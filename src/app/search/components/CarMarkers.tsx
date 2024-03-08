import useClusterer from "@/src/hooks/useClusterer";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import CarMarker from "./CarMarker";

const CarMarkers = () => {
  // Access to Store Data after Rendering (SSR Behavior)
  const filteredCars = useStore(useSearchStore, (state) => state.filteredCars);

  // Clusterer
  const clusterer = useClusterer();

  if (!filteredCars) return;
  return (
    <>
      {filteredCars.map((car) => {
        return <CarMarker key={car.id} car={car} clusterer={clusterer} />;
      })}
    </>
  );
};

export default CarMarkers;
