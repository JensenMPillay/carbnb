import { buttonVariants } from "@/src/components/ui/button";
import useClusterer from "@/src/hooks/useClusterer";
import useMarker from "@/src/hooks/useMarker";
import { cn } from "@/src/lib/utils";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const CarMarkers = () => {
  // Cars Store
  const { setCarSelected } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const filteredCars = useStore(useSearchStore, (state) => state.filteredCars);
  const carSelected = useStore(useSearchStore, (state) => state.carSelected);

  const clusterer = useClusterer();

  const markerLibrary = useMarker();

  // Update Markers
  useEffect(() => {
    if (!clusterer || !markerLibrary) return;
    // Clean All Markers
    clusterer.clearMarkers();
  }, [markerLibrary, clusterer, filteredCars]);

  if (!filteredCars) return;
  return (
    <>
      {filteredCars.map((car) => {
        const {
          id,
          brand,
          model,
          pricePerDay,
          location: { latitude, longitude },
        } = car;
        if (!latitude || !longitude) return;
        return (
          <AdvancedMarker
            position={{ lat: latitude, lng: longitude }}
            key={id}
            title={`${brand} ${model}`}
            ref={(marker) => {
              marker && clusterer?.addMarker(marker);
            }}
            gmpClickable
            onClick={() => setCarSelected(car)}
          >
            <span
              className={cn(
                buttonVariants({
                  variant: carSelected != car ? "default" : "secondary",
                  size: "sm",
                }),
              )}
            >
              {pricePerDay}
              <span>€</span>
            </span>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default CarMarkers;
