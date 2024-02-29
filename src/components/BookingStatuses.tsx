import { BookingStatus } from "@prisma/client";
import {
  CheckCircledIcon,
  CheckIcon,
  CircleIcon,
  ClockIcon,
  Cross2Icon,
  CrossCircledIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

export type StatusProps = {
  label: BookingStatus;
  icon: (props: IconProps & React.RefAttributes<SVGSVGElement>) => JSX.Element;
  tooltip: string;
  variant: "default" | "destructive" | "outline" | "secondary";
};

export const BookingStatuses: Record<BookingStatus, StatusProps> = {
  [BookingStatus.PENDING]: {
    label: BookingStatus.PENDING,
    icon: (props) => <CircleIcon {...props} />,
    tooltip: "This booking is pending approval from the owner.",
    variant: "outline",
  },
  [BookingStatus.WAITING]: {
    label: BookingStatus.WAITING,
    icon: (props) => <ClockIcon {...props} />,
    tooltip: "This booking is waiting for confirmation.",
    variant: "outline",
  },
  [BookingStatus.ACCEPTED]: {
    label: BookingStatus.ACCEPTED,
    icon: (props) => <CheckCircledIcon {...props} />,
    tooltip: "This booking has been accepted.",
    variant: "default",
  },
  [BookingStatus.REFUSED]: {
    label: BookingStatus.REFUSED,
    icon: (props) => <CrossCircledIcon {...props} />,
    tooltip: "This booking has been refused.",
    variant: "destructive",
  },
  [BookingStatus.IN_PROGRESS]: {
    label: BookingStatus.IN_PROGRESS,
    icon: (props) => <TimerIcon {...props} />,
    tooltip: "This booking is in progress.",
    variant: "secondary",
  },
  [BookingStatus.COMPLETED]: {
    label: BookingStatus.COMPLETED,
    icon: (props) => <CheckIcon {...props} />,
    tooltip: "This booking has been completed successfully.",
    variant: "default",
  },
  [BookingStatus.CANCELED]: {
    label: BookingStatus.CANCELED,
    icon: (props) => <Cross2Icon {...props} />,
    tooltip: "This booking has been canceled.",
    variant: "destructive",
  },
};
