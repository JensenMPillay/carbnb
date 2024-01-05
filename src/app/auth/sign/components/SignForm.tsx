"use client";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import useAuthForm from "@/src/hooks/useAuthForm";
import { customTheme } from "@/src/lib/auth-ui/customTheme";
import { supabaseBrowserClient } from "@/src/lib/supabase/supabase-browser-client";
import { Auth } from "@supabase/auth-ui-react";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import Router from "next/router";
import { useEffect } from "react";

type Props = {};

const SignForm = (props: Props) => {
  // Theme
  const { resolvedTheme } = useTheme();

  // Origin
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // useAuthForm Hook
  const { isFormLoading, session } = useAuthForm();

  // useAuthForm Callback
  useEffect(() => {
    if (session)
      Router.push(
        `/api/auth/callback?from=sign${origin ? "&origin=" + origin : ""}`,
      );

    return () => {};
  }, [origin, session]);

  return (
    <>
      {isFormLoading ? (
        <div className="my-2 flex flex-1 flex-col items-center space-y-6 md:my-3 lg:my-4">
          <Skeleton className="h-12 w-full" />
          <Separator orientation="horizontal" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <Auth
          supabaseClient={supabaseBrowserClient}
          providers={["google"]}
          appearance={{
            theme: customTheme,
            extend: true,
          }}
          theme={resolvedTheme}
          queryParams={{
            access_type: "offline",
            prompt: "consent",
            // hd: "domain.com",
          }}
          redirectTo={`/api/auth/callback?from=sign${
            origin ? "&origin=" + origin : ""
          }`}
        />
      )}
    </>
  );
};

export default SignForm;
