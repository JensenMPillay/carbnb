import { cookies } from "next/headers";
import BookingContainer from "./components/BookingContainer";

import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { redirect } from "next/navigation";

export default async function Booking() {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user || !user.user_metadata.isRegistered)
    return redirect("/auth/sign?origin=booking");
  return <BookingContainer />;
}
