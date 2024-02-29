import { TabsContent } from "@/src/components/ui/tabs";
import { constructMetadata } from "@/src/lib/utils";
import RenterBookings from "./components/RenterBookings";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard | Renter Space",
  description: "Manage your bookings on Carbnb",
});

export default async function RenterSpace({}: Props) {
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
