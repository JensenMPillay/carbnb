import { TabsContent } from "@/src/components/ui/tabs";
import { constructMetadata } from "@/src/lib/utils";
import RenterBookings from "./components/RenterBookings";

import type { Metadata } from "next";

/**
 * Constructs metadata for the Renter Space page.
 */
export const metadata: Metadata = constructMetadata({
  title: "Carbnb | Dashboard | Renter Space",
  description: "Manage your bookings on Carbnb",
});

/**
 * Renter Space page component.
 */
export default async function RenterSpace() {
  return (
    <TabsContent
      value="/dashboard/renterspace"
      className="mt-0 flex-1"
      forceMount
    >
      <RenterBookings />
    </TabsContent>
  );
}
