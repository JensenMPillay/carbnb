import { format } from "date-fns";
import { cn } from "../lib/utils";
import { Card } from "./ui/card";

type BookingInfoCardProps = {
  address: string;
  startDate: Date;
  endDate: Date;
  size?: "sm" | "md" | "lg";
};

const BookingInfoCard = ({
  address,
  startDate,
  endDate,
  size = "sm",
}: BookingInfoCardProps) => {
  return (
    <Card
      className={cn(
        "mt-2 bg-card/75 p-1 text-xs",
        size === "md" && "md:p-3 md:text-sm",
        size === "lg" && "md:text-sm lg:p-4 lg:text-base",
      )}
    >
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
