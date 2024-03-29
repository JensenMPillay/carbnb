"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import DataTableContent from "./DataTableContent";
import DataTablePagination from "./DataTablePagination";
import DataTableToolbar from "./DataTableToolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

/**
 * DataTable component to display tabular data with sorting, filtering, and pagination functionalities.
 * @component
 * @template TData - The type of data in the table.
 * @template TValue - The type of value in the table.
 * @param {object} props - The props object.
 * @param {ColumnDef<TData, TValue>[]} props.columns - The array of column definitions.
 * @param {TData[]} props.data - The array of data to be displayed in the table.
 * @example
 * <DataTable
    columns={columns}
    data={bookings}
  />
 */
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // For Sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  // For Filtering
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // For Visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // For Selection
  const [rowSelection, setRowSelection] = useState({});

  // Hook ReactTable
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <DataTableToolbar table={table} />
      <DataTableContent table={table} columns={columns} />
      <DataTablePagination table={table} />
    </>
  );
}
