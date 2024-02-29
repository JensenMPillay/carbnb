import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

function TableHeader<TData, TValue>({
  column,
  title,
  position,
}: {
  column: Column<TData, TValue>;
  title: string;
  position: string;
}) {
  return (
    <div className="flex w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className={cn("w-full capitalize", {
          "justify-start pl-0": position === "left",
          "justify-center": position === "center",
          "justify-end pr-0": position === "right",
        })}
      >
        {title}
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    </div>
  );
}

export default TableHeader;
