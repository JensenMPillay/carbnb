import prisma from "@/prisma/prisma";
import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import type { CookieOptions } from "@supabase/ssr";

/**
 * GET function for handling GET requests to authenticate users and redirect them based on their session status.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a Next.js response object.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.searchParams.get("origin");

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

  // Mail Verification
  if (code) await supabaseApiServerClient.auth.exchangeCodeForSession(code);

  const {
    data: { session },
    error,
  } = await supabaseApiServerClient.auth.getSession();

  // No Session
  if (!session || error)
    return NextResponse.redirect(
      origin
        ? `${requestUrl.origin}/auth/sign?origin=${origin}`
        : `${requestUrl.origin}/auth/sign`,
    );

  const user = session.user;

  // Database Verification
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id!,
    },
  });

  // Registration
  if (!dbUser)
    return NextResponse.redirect(
      origin
        ? `${requestUrl.origin}/auth/register?origin=${origin}`
        : `${requestUrl.origin}/auth/register`,
    );

  const isRegistered = user.user_metadata.isRegistered;

  // Update MetaData
  if (!isRegistered)
    await supabaseApiServerClient.auth.updateUser({
      data: {
        isRegistered: true,
      },
    });

  // Redirection
  return NextResponse.redirect(
    origin ? `${requestUrl.origin}/${origin}` : requestUrl.origin,
  );
}
