import { Badge } from "@/src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { BookingStatuses } from "@/src/lib/status/BookingStatuses";
import { BookingStatus } from "@prisma/client";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

/**
 * BookingStatusBadge component for displaying booking status with tooltip.
 * @component
 * @param {object} props - The props object.
 * @param {BookingStatus} props.status - The booking status.
 * @example
 * <BookingStatusBadge status="ACCEPTED" />
 */
const BookingStatusBadge = ({ status }: { status: BookingStatus }) => {
  const { label, tooltip, variant } = BookingStatuses[status];
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center space-x-2">
        <Badge variant={variant}>{label}</Badge>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="cursor-default">
            <QuestionMarkCircledIcon className="size-4 text-zinc-500" />
          </TooltipTrigger>
          <TooltipContent className="w-auto p-2">
            <span>{tooltip}</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default BookingStatusBadge;
