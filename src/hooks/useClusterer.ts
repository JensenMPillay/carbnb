import { PRIMARY_COLOR } from "@/src/lib/utils";
import type { Cluster, ClusterStats } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useRef } from "react";

const useClusterer = () => {
  // Parent Map
  const map = useMap();
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

  // Verify Map
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("Clusterer has to be inside a Map component.");
      return;
    }
  }, [map]);

  // Initialize MarkerClusterer when Map Changing
  useEffect(() => {
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: customRenderer,
      });
    }
  }, [map, customRenderer]);

  return clusterer.current;
};

export default useClusterer;
