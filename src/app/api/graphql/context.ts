import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { CookieOptions } from "@supabase/ssr";
import type { NextApiRequest } from "next";

/**
 * Defines a function to create the Supabase context for handling Supabase client and user session.
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 * @returns The Supabase context including the request, Supabase client, user, and access token.
 */
export async function supabaseContext(req: NextApiRequest) {
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

  if (!session || typeof session === "undefined" || error) return {};

  const { user, access_token } = session;

  return { req, supabase, user, access_token };
}
