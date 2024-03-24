import useClusterer from "@/src/hooks/useClusterer";
import useStore from "@/src/hooks/useStore";
import useSearchStore from "@/src/store/useSearchStore";
import CarMarker from "./CarMarker";

/**
 * Component for rendering car markers on the map.
 * @component
 * @example
 * <CarMarkers />
 */
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
