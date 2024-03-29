"use client";
import { BookingQuery, CarQuery } from "@/src/@types/queries.types";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import BookingStatusBadge from "../../../../../components/BookingStatusBadge";
import BookingTableActionButtons from "./BookingTableActionButtons";
import TableHeader from "./TableHeader";

/**
 * Definition of columns for the booking table.
 */
export const bookingColumns: ColumnDef<BookingQuery>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: string | boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: string | boolean) =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "car",
    header: ({ column }) => {
      return <TableHeader column={column} title="car" position="left" />;
    },
    enableColumnFilter: true,
    cell: ({ row }) => {
      const carBooking = row.getValue("car");
      const { brand, model } = carBooking as CarQuery;
      return (
        <div className="space-x-2 truncate text-left font-medium normal-case">
          <span className="font-semibold capitalize">
            {brand.replace("_", " ")}
          </span>
          <span className="font-light uppercase">{model}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <TableHeader column={column} title="startDate" position="center" />
      );
    },
    enableColumnFilter: false,
    cell: ({ row }) => {
      const formattedStartDate = format(
        new Date(row.getValue("startDate")),
        "dd MMM yyyy",
      );
      return <div className="text-center">{formattedStartDate}</div>;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return <TableHeader column={column} title="endDate" position="center" />;
    },
    enableColumnFilter: false,
    cell: ({ row }) => {
      const formattedEndDate = format(
        new Date(row.getValue("endDate")),
        "dd MMM yyyy",
      );
      return <div className="text-center">{formattedEndDate}</div>;
    },
  },
  {
    id: "address",
    accessorFn: (row) => `${row.car.location.formatted_address}`,
    header: ({ column }) => {
      return <TableHeader column={column} title="address" position="left" />;
    },
    enableColumnFilter: false,
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("address")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <TableHeader column={column} title="status" position="center" />;
    },
    enableColumnFilter: true,
    cell: ({ row }) => {
      return <BookingStatusBadge status={row.getValue("status")} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <TableHeader column={column} title="date" position="center" />;
    },
    enableColumnFilter: false,
    cell: ({ row }) => {
      const formattedCreatedAt = format(
        new Date(row.getValue("createdAt")),
        "dd MMM yyyy",
      );
      return <div className="text-center">{formattedCreatedAt}</div>;
    },
  },
  {
    id: "actions",
    enableColumnFilter: false,
    cell: ({ row }) => {
      const { id, status } = row.original;
      if (status != "WAITING") return;
      return <BookingTableActionButtons bookingId={id} />;
    },
  },
];
