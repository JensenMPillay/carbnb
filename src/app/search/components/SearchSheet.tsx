"use client";
import CarCard from "@/src/components/CarCard";
import { buttonVariants } from "@/src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { cn } from "@/src/lib/utils";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import Link from "next/link";

const SearchSheet = () => {
  // Cars Store
  const { setCarSelected } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const carSelected = useStore(useSearchStore, (state) => state.carSelected);
  return (
    <Sheet open={!!carSelected} onOpenChange={() => setCarSelected(null)}>
      <SheetContent className="flex flex-col justify-center">
        <SheetHeader>
          <SheetTitle>Start Your Journey Here!</SheetTitle>
          <SheetDescription>
            Discover the details of this vehicle and begin planning your next
            adventure on wheels.
          </SheetDescription>
        </SheetHeader>
        {carSelected && <CarCard car={carSelected} />}
        <SheetFooter>
          <SheetClose asChild>
            <Link href="/booking" className={cn(buttonVariants())}>
              Book
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SearchSheet;
