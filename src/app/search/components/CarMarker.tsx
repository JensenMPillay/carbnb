import { CarQuery } from "@/src/@types/queries.types";
import { buttonVariants } from "@/src/components/ui/button";
import useStore from "@/src/hooks/useStore";
import { cn } from "@/src/lib/utils";
import useSearchStore from "@/src/store/useSearchStore";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

type CarMarkerProps = {
  car: CarQuery;
  clusterer: MarkerClusterer | null;
};

/**
 * Component representing a single car marker on the map.
 * @component
 * @param {CarMarkerProps} props - Props for the CarMarker component.
 * @param {CarQuery} props.car - Information about the car associated with the marker.
 * @param {MarkerClusterer | null} props.clusterer - The marker clusterer used to manage the marker.
 * @example
 * <>
      {cars.map((car) => {
        return <CarMarker key={car.id} car={car} clusterer={clusterer} />;
      })}
  </>
 */
const CarMarker = ({ car, clusterer }: CarMarkerProps) => {
  const {
    id,
    brand,
    model,
    pricePerDay,
    location: { latitude, longitude },
  } = car;
  // Car Selection Handler
  const { setCarSelected } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const carSelected = useStore(useSearchStore, (state) => state.carSelected);

  // Marker Ref
  const [refCallback, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    if (!clusterer || !marker) return;
    clusterer.addMarker(marker);

    return () => {
      clusterer.removeMarker(marker);
    };
  }, [clusterer, marker]);

  if (!latitude || !longitude) return;
  return (
    <AdvancedMarker
      position={{ lat: latitude, lng: longitude }}
      key={id}
      title={`${brand} ${model}`}
      ref={refCallback}
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
};

export default CarMarker;
