import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import BookingContainer from "./components/BookingContainer";

import { Database } from "@/src/lib/supabase/database.types";
import { redirect } from "next/navigation";

export default async function Booking() {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user || !user.user_metadata.isRegistered)
    return redirect("/auth/sign?origin=booking");
  return <BookingContainer />;
}
