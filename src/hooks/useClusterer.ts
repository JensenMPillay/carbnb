import { colors } from "@/src/config/theme";
import { createSVGClustererIcon } from "@/src/lib/utils";
import type { Cluster, ClusterStats } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useRef } from "react";

const useClusterer = () => {
  // Parent Map
  const map = useMap();
  // Clusterer State
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Renderer of ClusterMarker (Icon Style)
  const customRenderer = useMemo(
    () => ({
      render: ({ count, position }: Cluster, stats: ClusterStats) => {
        // Adjust Color by Count markers
        const color =
          count > Math.max(10, stats.clusters.markers.mean)
            ? colors.destructive.DEFAULT
            : colors.primary.DEFAULT;

        //  Title
        const title = `${count} available cars`;

        // zIndex to be above other markers
        const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;

        // Advanced Marker Options
        const clusterOptions = {
          map,
          position,
          zIndex,
          title,
          content: createSVGClustererIcon(color, count),
        };

        return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
      },
    }),
    [map],
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
