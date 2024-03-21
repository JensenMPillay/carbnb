import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";

/**
 * Get supabase client for use in the browser.
 */
const supabaseBrowserClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default supabaseBrowserClient;
