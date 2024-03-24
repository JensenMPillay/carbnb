import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  ColumnDef,
  Table as TableType,
  flexRender,
} from "@tanstack/react-table";

interface DataTableContentProps<TData, TValue> {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
}

/**
 * DataTableContent component for rendering the content of the data table.
 * @component
 * @template TData - The type of data in the table.
 * @template TValue - The type of value in the table.
 * @param {object} props - The props object.
 * @param {TableType<TData>} props.table - The table object.
 * @param {ColumnDef<TData, TValue>[]} props.columns - The array of column definitions.
 * @example
 * <DataTableContent table={table} columns={columns} />
 */
export default function DataTableContent<TData, TValue>({
  table,
  columns,
}: DataTableContentProps<TData, TValue>) {
  return (
    <div className="rounded-md border py-1">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    <div className="flex w-full flex-row">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="my-8 flex flex-col items-center gap-2">
                  <p className="text-xl font-semibold">
                    Oops! No bookings found ...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
