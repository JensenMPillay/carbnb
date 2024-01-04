import type { NextApiRequest, NextApiResponse } from "next";

import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseContext(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
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

  const { data, error } = await supabase.auth.getSession();

  const { session } = data;

  if (!session || typeof session === "undefined") return {};

  const { user, access_token } = session;

  return { user, access_token };
}
