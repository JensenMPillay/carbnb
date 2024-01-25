import { TabsContent } from "@/src/components/ui/tabs";
import AddCarButton from "../components/AddCarButton";
import UserCars from "../components/UserCars";

type Props = {};

function Cars({}: Props) {
  return (
    <TabsContent value="/dashboard/cars" className="mt-0 flex-1" forceMount>
      <div className="flex h-full w-full flex-col">
        <UserCars />
        <div className="mb-1 mt-auto w-full space-y-1 text-center">
          <AddCarButton />
        </div>
      </div>
    </TabsContent>
  );
}

export default Cars;
