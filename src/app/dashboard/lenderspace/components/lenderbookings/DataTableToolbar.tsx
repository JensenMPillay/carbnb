"use client";
import { Button } from "@/src/components/ui/button";
import { BookingStatuses } from "@/src/lib/status/BookingStatuses";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import DataTableFacetedFilter from "./DataTableFacetedFilter";
import DataTableViewOptions from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

/**
 * DataTableToolbar component for rendering the toolbar of the data table.
 * @component
 * @template TData - The type of data in the table.
 * @param {object} props - The props object.
 * @param {Table<TData>} props.table - The table object.
 * @example
 * <DataTableToolbar table={table} />
 */
export default function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="status"
            options={BookingStatuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 text-xs lg:px-3"
          >
            Reset
            <CrossCircledIcon className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
