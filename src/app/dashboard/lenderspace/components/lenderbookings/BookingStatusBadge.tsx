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
