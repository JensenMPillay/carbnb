import { createServerClient } from "@supabase/ssr";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Database } from "./database.types";

/**
 * Creates a Supabase server client using cookies for authentication.
 * @param {ReadonlyRequestCookies} cookies - Cookies object containing the authentication token.
 * @return {SupabaseClient<Database>} Supabase server client configured with cookies for authentication.
 * @example
 * import { cookies } from "next/headers";
 *
 * const cookieStore = cookies();
 * const supabaseServerClient = getSupabaseServerClient(cookieStore);
 * // Output: Supabase server client configured with cookies for authentication.
 */
const getSupabaseServerClient = (cookies: ReadonlyRequestCookies) =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name)?.value;
        },
      },
    },
  );

export default getSupabaseServerClient;
