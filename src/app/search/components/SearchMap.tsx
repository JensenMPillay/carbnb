"use client";
import { Circle } from "@/src/components/Circle";
import useMarker from "@/src/hooks/useMarker";
import useStore from "@/src/hooks/useStore";
import useSearchStore from "@/src/store/useSearchStore";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import CarMarkers from "./CarMarkers";
import FiltersSheet from "./FiltersSheet";

/**
 * Component for displaying the search map with markers and filters.
 * Provides the necessary context for using the Google Maps API.
 * @component
 * @example
 * <SearchMap />
 */
const SearchMap = () => {
  // Marker Library
  const markerLibrary = useMarker();

  // Access to Store Data after Rendering (SSR Behavior)
  const userLocation = useStore(
    useSearchStore,
    (state) => state.searchValues?.formattedLocation,
  );
  const radius = useStore(useSearchStore, (state) => state.filters?.radius);

  if (!markerLibrary) return;
  return (
    <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? ""}
      className="relative h-[75dvh] w-full rounded"
      defaultZoom={10}
      defaultCenter={userLocation}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      <AdvancedMarker
        position={userLocation}
        title={userLocation?.description}
      />
      <Circle
        radius={radius && radius * 1000}
        center={userLocation}
        strokeColor={"#4cc2ae"}
        strokeOpacity={1}
        strokeWeight={3}
        fillColor={"#4cc2ae"}
        fillOpacity={0.3}
        clickable={false}
        draggable={false}
        editable={false}
      />
      <CarMarkers />
      <FiltersSheet />
    </Map>
  );
};

export default SearchMap;
