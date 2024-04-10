import { cookies } from "next/headers";
import BookingContainer from "./components/BookingContainer";

import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { redirect } from "next/navigation";

/**
 * Booking page component.
 */
export default async function Booking() {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabaseServerClient.auth.getUser();

  if (!user || !user.user_metadata.isRegistered || error)
    return redirect("/auth/sign?origin=booking");
  return <BookingContainer />;
}
