import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";

const cookieStore = cookies();

export const supabaseServerClient = createServerClient<Database>(
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
