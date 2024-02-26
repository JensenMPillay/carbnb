import { format } from "date-fns";
import { Card } from "./ui/card";

type BookingInfoCardProps = {
  address: string;
  startDate: Date;
  endDate: Date;
};

const BookingInfoCard = ({
  address,
  startDate,
  endDate,
}: BookingInfoCardProps) => {
  return (
    <Card className="mt-2 bg-card/75 text-xs md:p-3 md:text-sm lg:p-4 lg:text-base">
      <p className="truncate text-center">{address}</p>
      <p className="flex flex-row justify-around">
        <span>{format(startDate, "yyyy-MM-dd")}</span>
        <span>-</span>
        <span>{format(endDate, "yyyy-MM-dd")}</span>
      </p>
    </Card>
  );
};

export default BookingInfoCard;
