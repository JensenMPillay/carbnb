import { Button } from "@/src/components/ui/button";
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

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard | Lender Space",
  description:
    "Manage your car rental listings and received reservations on Carbnb.",
});

export default async function LenderSpace({}: Props) {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user) return;
  return (
    <TabsContent
      value="/dashboard/lenderspace"
      className="mt-0 flex-1"
      forceMount
    >
      {user.user_metadata.role != "LENDER" ? (
        <Button>Become a Lender</Button>
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