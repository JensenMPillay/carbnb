"use client";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import useLoading from "@/src/hooks/useLoading";
import { customTheme } from "@/src/lib/auth-ui/customTheme";
import { showNotif } from "@/src/lib/notifications/toasters";
import { supabaseBrowserClient } from "@/src/lib/supabase/supabase-browser-client";
import useSessionStore from "@/src/store/useSessionStore";
import { Auth } from "@supabase/auth-ui-react";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {};

const SignForm = (props: Props) => {
  // Session
  const { syncSession } = useSessionStore();

  // Theme
  const { resolvedTheme } = useTheme();

  // Router
  const router = useRouter();

  // Origin
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // Loading Hook
  const { isLoading } = useLoading();

  useEffect(() => {
    // Auth Change Subscription
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        showNotif({
          description: "You'll be redirected shortly!",
        });
        await syncSession();
        router.push(`/api/auth/callback${origin ? "?origin=" + origin : ""}`);
      }
    });
    return () => {
      // Unsubscription
      subscription.unsubscribe();
    };
  }, [syncSession, router, origin]);

  return (
    <>
      {isLoading ? (
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
        />
      )}
    </>
  );
};

export default SignForm;
