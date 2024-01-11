import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabaseBrowserClient } from "../lib/supabase/supabase-browser-client";

type SessionStore = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  syncSession: () => Promise<void>;
};

const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      // Data
      session: null,
      // Setter
      setSession: (newSession) => set({ session: newSession }),
      // Sync Supabase Session to Local Storage Session
      syncSession: async () => {
        const {
          data: { session: sessionData },
          error,
        } = await supabaseBrowserClient.auth.getSession();
        set({ session: sessionData });
      },
    }),
    // For Persisting Global Data State (Local Storage)
    {
      name: "session", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useSessionStore;
