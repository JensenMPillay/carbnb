import { TabsContent } from "@/src/components/ui/tabs";
import UserBookings from "../components/UserBookings";

type Props = {};

function Bookings({}: Props) {
  return (
    <TabsContent value="/dashboard/bookings" className="mt-0 flex-1">
      <UserBookings />
    </TabsContent>
  );
}

export default Bookings;
