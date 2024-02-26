import supabaseServerClient from "@/src/lib/supabase/supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { redirect } from "next/navigation";

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

  if (!user || !user.user_metadata.isRegistered)
    return redirect("/auth/sign?origin=dashboard");

  return redirect("/dashboard/profile");
}
