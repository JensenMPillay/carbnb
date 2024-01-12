import { CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { supabaseServerClient } from "@/src/lib/supabase/supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { redirect } from "next/navigation";
import DeleteUserButton from "./components/DeleteUserButton";
import UpdateUserForm from "./components/UpdateUserForm";
import UserBookings from "./components/UserBookings";
import UserCars from "./components/UserCars";

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard",
  description: "Manage your car rental listings and bookings on Carbnb",
});

export default async function Dashboard() {
  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user || !user.user_metadata.name) return redirect("/");

  return (
    <Tabs className="flex h-full w-full flex-col" defaultValue="profile">
      <CardHeader className="flex w-full p-2 md:p-3 lg:p-4">
        <CardTitle className="text-xl font-bold">Dashboard</CardTitle>
      </CardHeader>
      <Separator orientation="horizontal" />
      <CardContent className="flex flex-1 flex-col p-0 lg:flex-row">
        <TabsList className="flex h-fit w-full justify-start rounded-none lg:h-full lg:w-fit lg:flex-col ">
          <TabsTrigger value="profile" className="">
            Profile
          </TabsTrigger>
          <TabsTrigger value="cars" className="">
            Cars
          </TabsTrigger>
          <TabsTrigger value="bookings" className="">
            Booking
          </TabsTrigger>
        </TabsList>
        <Separator orientation="horizontal" className="block lg:hidden" />
        <Separator orientation="vertical" className="hidden lg:block" />
        <TabsContent value="profile" className="mt-0 flex-1">
          <UpdateUserForm />
          <Separator orientation="horizontal" />
          <DeleteUserButton />
        </TabsContent>
        <TabsContent value="cars" className="mt-0 flex-1">
          <UserCars />
        </TabsContent>
        <TabsContent value="bookings" className="mt-0 flex-1">
          <UserBookings />
        </TabsContent>
      </CardContent>
      <Separator orientation="horizontal" />
    </Tabs>
  );
}
