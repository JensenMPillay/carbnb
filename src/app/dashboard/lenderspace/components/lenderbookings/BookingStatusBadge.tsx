import { BookingStatuses } from "@/src/components/BookingStatuses";
import { Badge } from "@/src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { BookingStatus } from "@prisma/client";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

const BookingStatusBadge = ({ value }: { value: BookingStatus }) => {
  const { label, tooltip, variant } = BookingStatuses[value];
  return (
    <TooltipProvider>
      <div className="flex w-full items-center justify-center">
        <Badge variant={variant}>{label}</Badge>
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="ml-1.5 cursor-default">
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
