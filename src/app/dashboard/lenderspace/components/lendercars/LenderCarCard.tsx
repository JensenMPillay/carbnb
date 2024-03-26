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

/**
 * Component representing a card displaying information about a car for lenders.
 * @component
 * @param {object} props - The props object.
 * @param {CarQuery} props.car - The car data to be displayed.
 * @example
 * cars.map((car: CarQuery) => (
    <LenderCarCard key={car.id} car={car} />
  ))}
 */
const LenderCarCard = ({ car }: CarProps) => {
  // Mutation
  const [updateCar] = useMutation(UPDATE_CAR_MUTATION, {
    onCompleted: async () => {
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
        <DeleteCarButton carId={car.id} />
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
