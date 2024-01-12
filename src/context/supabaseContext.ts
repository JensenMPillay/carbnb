import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";

export async function supabaseContext(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    process.env.SUPABASE_ADMIN_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getSession();

  const { session } = data;

  if (!session || typeof session === "undefined") return {};

  const { user, access_token } = session;

  return { supabase, user, access_token };
}
