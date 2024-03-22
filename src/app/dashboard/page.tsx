import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

/**
 * Constructs metadata for the Dashboard component.
 */
export const metadata: Metadata = constructMetadata({
  title: "Carbnb | Dashboard",
  description: "Manage your car rental listings and bookings on Carbnb",
});

/**
 * Dashboard page component.
 */
export default async function Dashboard() {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user || !user.user_metadata.isRegistered)
    return redirect("/auth/sign?origin=dashboard");

  return redirect("/dashboard/profile");
}
