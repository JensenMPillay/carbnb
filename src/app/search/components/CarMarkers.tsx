import { buttonVariants } from "@/src/components/ui/button";
import { PRIMARY_COLOR, cn } from "@/src/lib/utils";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import type {
  Cluster,
  ClusterStats,
  Marker,
} from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useRef, useState } from "react";

const CarMarkers = () => {
  // Parent Map
  const map = useMap();

  // Markers State
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

  // Clusterer State
  const clusterer = useRef<MarkerClusterer | null>(null);

  // custom Renderer of ClusterMarker (Icon Style)
  const customRenderer = useMemo(
    () => ({
      render: ({ count, position }: Cluster, stats: ClusterStats) => {
        const color =
          count > Math.max(10, stats.clusters.markers.mean)
            ? "#ff0000"
            : PRIMARY_COLOR;

        // create svg url with fill color
        const svg = window.btoa(`
       <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
         <circle cx="120" cy="120" opacity=".6" r="70" />
         <circle cx="120" cy="120" opacity=".3" r="90" />
         <circle cx="120" cy="120" opacity=".2" r="110" />
         <circle cx="120" cy="120" opacity=".1" r="130" />
       </svg>`);

        // create marker using svg icon
        return new google.maps.Marker({
          position,
          icon: {
            url: `data:image/svg+xml;base64,${svg}`,
            scaledSize: new google.maps.Size(45, 45),
          },
          label: {
            text: String(count),
            color: "rgba(255,255,255,0.9)",
            fontSize: "9px",
          },
          // adjust zIndex to be above other markers
          zIndex: 1000 + count,
        });
      },
    }),
    [],
  );

  // Cars Store
  const { setCarSelected } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const cars = useStore(useSearchStore, (state) => state.cars);
  const carSelected = useStore(useSearchStore, (state) => state.carSelected);

  // Initialize MarkerClusterer when Map Changing
  useEffect(() => {
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: customRenderer,
      });
    }
  }, [map, customRenderer]);

  // Update Markers
  useEffect(() => {
    // Clean All Markers
    // !!!Warning : This line re-renders markers infinitely!!!
    // clusterer.current?.clearMarkers();
    // Add All Markers
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  // Sync Markers
  const setMarkerRef = (marker: Marker | null, key: string) => {
    // Marker not in Markers => +
    // Not Marker but in Markers => -
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  if (!map) return;
  return (
    <>
      {cars &&
        cars.map((car) => {
          const {
            id,
            category,
            brand,
            model,
            year,
            transmission,
            fuelType,
            imageUrl,
            pricePerDay,
            location: { latitude, longitude },
          } = car;
          if (!latitude || !longitude) return;
          return (
            <AdvancedMarker
              position={{ lat: latitude, lng: longitude }}
              key={id}
              title={`${brand} ${model}`}
              ref={(marker) => setMarkerRef(marker, id)}
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
