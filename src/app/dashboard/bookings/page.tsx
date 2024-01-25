import { TabsContent } from "@/src/components/ui/tabs";
import { constructMetadata } from "@/src/lib/utils";
import UserBookings from "./components/UserBookings";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard | Bookings",
  description: "Manage your bookings on Carbnb",
});

function Bookings({}: Props) {
  return (
    <TabsContent value="/dashboard/bookings" className="mt-0 flex-1" forceMount>
      <UserBookings />
    </TabsContent>
  );
}

export default Bookings;
