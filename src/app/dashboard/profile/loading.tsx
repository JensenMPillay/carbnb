import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto my-2 flex w-3/4 flex-col items-center md:my-3 lg:my-4">
      <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
      <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
      <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
      <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
      <Separator orientation="horizontal" className="w-full" />
      <Skeleton className="ml-auto mt-4 h-10 w-1/6 md:mt-8 lg:mt-12" />
    </div>
  );
}
