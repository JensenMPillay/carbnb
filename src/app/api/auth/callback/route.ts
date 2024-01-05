import prisma from "@/prisma/prisma";
import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import type { CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.searchParams.get("origin");
  const from = requestUrl.searchParams.get("from");

  // Supabase Client
  const cookieStore = cookies();

  const supabaseApiServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  if (code) {
    await supabaseApiServerClient.auth.exchangeCodeForSession(code);
  }

  if (from === "sign") {
    const {
      data: { session },
      error,
    } = await supabaseApiServerClient.auth.getSession();

    const user = session!.user!;

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id!,
      },
    });

    if (dbUser) {
      return NextResponse.redirect(
        origin ? `${requestUrl.origin}/${origin}` : requestUrl.origin,
      );
    } else {
      return NextResponse.redirect(`${requestUrl.origin}/auth/register`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
