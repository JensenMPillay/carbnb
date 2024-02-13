"use client";
import { Circle } from "@/src/components/Circle";
import { FormattedLocation } from "@/src/hooks/useGeocoder";
import useMarker from "@/src/hooks/useMarker";
import { PRIMARY_COLOR } from "@/src/lib/utils";
import { Map, Marker } from "@vis.gl/react-google-maps";
import CarMarkers from "./CarMarkers";

type SearchMapProps = {
  userLocation: FormattedLocation | undefined;
};

const SearchMap = ({ userLocation }: SearchMapProps) => {
  // Marker Library State
  const markerLoaded = useMarker();
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
    </Map>
  );
};

export default SearchMap;
