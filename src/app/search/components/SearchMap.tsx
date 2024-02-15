"use client";
import { Circle } from "@/src/components/Circle";
import useMarker from "@/src/hooks/useMarker";
import { PRIMARY_COLOR } from "@/src/lib/utils";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import { Map, Marker } from "@vis.gl/react-google-maps";
import CarMarkers from "./CarMarkers";
import FiltersSheet from "./FiltersSheet";

const SearchMap = () => {
  // Marker Library State
  const markerLoaded = useMarker();

  // Access to Store Data after Rendering (SSR Behavior)
  const userLocation = useStore(
    useSearchStore,
    (state) => state.searchValues?.formattedLocation,
  );

  if (!markerLoaded) return;
  return (
    <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? ""}
      className="h-[75dvh] w-full rounded"
      defaultZoom={10}
      defaultCenter={userLocation}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      <Marker position={userLocation} title={userLocation?.description} />
      <Circle
        radius={25000}
        center={userLocation}
        strokeColor={PRIMARY_COLOR}
        strokeOpacity={1}
        strokeWeight={3}
        fillColor={PRIMARY_COLOR}
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
