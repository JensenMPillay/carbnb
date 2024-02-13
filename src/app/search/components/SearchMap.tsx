"use client";
import { Circle } from "@/src/components/Circle";
import useMarker from "@/src/hooks/useMarker";
import { PRIMARY_COLOR } from "@/src/lib/utils";
import { Map, Marker } from "@vis.gl/react-google-maps";
import CarMarkers from "./CarMarkers";

type SearchMapProps = {
  locationLatLng: google.maps.LatLngLiteral | undefined;
};

const SearchMap = ({ locationLatLng }: SearchMapProps) => {
  // Marker Library State
  const markerLoaded = useMarker();
  if (!markerLoaded) return;
  return (
    <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? ""}
      className="h-[75dvh] w-full rounded"
      defaultZoom={10}
      defaultCenter={locationLatLng}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      <Marker position={locationLatLng} title="Location" />
      <Circle
        radius={25000}
        center={locationLatLng}
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
    </Map>
  );
};

export default SearchMap;
