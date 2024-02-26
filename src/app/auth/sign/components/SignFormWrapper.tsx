import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Suspense } from "react";
import SignForm from "./SignForm";

type Props = {};

const SignFormWrapper = (props: Props) => {
  return (
    <Suspense
      fallback={
        <div className="my-2 flex flex-1 flex-col items-center space-y-6 md:my-3 lg:my-4">
          <Skeleton className="h-12 w-full" />
          <Separator orientation="horizontal" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      }
    >
      <SignForm />
    </Suspense>
  );
};

export default SignFormWrapper;
