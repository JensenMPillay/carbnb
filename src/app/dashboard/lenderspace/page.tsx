import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { cookies } from "next/headers";
import LenderContent from "./components/LenderContent";
import RoleButton from "./components/RoleButton";

import type { Metadata } from "next";

/**
 * Constructs metadata for the Lender Space page.
 */
export const metadata: Metadata = constructMetadata({
  title: "Carbnb | Dashboard | Lender Space",
  description:
    "Manage your car rental listings and received reservations on Carbnb.",
});

export const dynamic = "force-dynamic";

export const revalidate = 0;

/**
 * Lender Space page component.
 */
export default async function LenderSpace() {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabaseServerClient.auth.getUser();

  if (!user || error) return;
  return (
    <TabsContent
      value="/dashboard/lenderspace"
      className="mt-0 flex-1"
      forceMount
    >
      {user.user_metadata.role != "LENDER" ? (
        <RoleButton role="LENDER" />
      ) : (
        <Tabs defaultValue="bookings" className="flex-1">
          <TabsList className="flex h-fit w-full justify-evenly rounded-none">
            <TabsTrigger className="capitalize" value="bookings">
              Bookings
            </TabsTrigger>
            <TabsTrigger className="capitalize" value="cars">
              Cars
            </TabsTrigger>
          </TabsList>
          <LenderContent />
        </Tabs>
      )}
    </TabsContent>
  );
}
