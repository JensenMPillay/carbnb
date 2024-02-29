"use client";
import { CarQuery } from "@/src/@types/queries.types";
import CarCard from "@/src/components/CarCard";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { UPDATE_CAR_MUTATION } from "@/src/lib/graphql/car";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { useMutation } from "@apollo/client";
import DeleteCarButton from "./DeleteCarButton";
import UpdateCarButton from "./UpdateCarButton";

type CarProps = {
  car: CarQuery;
};

const LenderCarCard = ({ car }: CarProps) => {
  // Mutation
  const [updateCar] = useMutation(UPDATE_CAR_MUTATION, {
    onCompleted: async (data) => {
      showNotif({
        description: "Your car is updated successfully",
      });
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
  });

  // Update Callback
  const onChange = async (checkValue: boolean) => {
    event?.preventDefault();
    try {
      if (car) {
        await updateCar({
          variables: { id: car.id, available: checkValue },
        });
      }
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };
  return (
    <CarCard car={car}>
      <div className="space-x-2">
        <UpdateCarButton car={car} />
        <DeleteCarButton car={car} />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={car.available}
          onCheckedChange={onChange}
        />
        <Label htmlFor="available" className="sr-only">
          Available
        </Label>
      </div>
    </CarCard>
  );
};

export default LenderCarCard;
