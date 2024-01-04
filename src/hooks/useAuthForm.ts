import { supabaseBrowserClient } from "@/src/lib/supabase/supabase-browser-client";
import { useEffect, useState } from "react";
import { Session } from "../lib/supabase/client.types";

const useAuthForm = () => {
  // Auth Form
  const [isFormLoading, setIsFormLoading] = useState<boolean>(true);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setIsFormLoading(false);
    // Auth Change Subscription
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange(async (event, session) => {
      // Callback
      if (session) {
        setSession(session);
        subscription.unsubscribe();
      }
    });

    return () => {
      // Unsubscription
      subscription.unsubscribe();
      setIsFormLoading(true);
    };
  }, []);
  return { isFormLoading, session };
};

export default useAuthForm;