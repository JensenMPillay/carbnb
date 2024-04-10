import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import supabaseBrowserClient from "../lib/supabase/supabase-browser-client";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  syncUser: () => Promise<void>;
};

/**
 * User store managing user state in the application.
 */
const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      // Data
      user: null,
      // Setter
      setUser: (newUser) => set({ user: newUser }),
      // Sync Supabase User to Local Storage User
      syncUser: async () => {
        const {
          data: { user: userData },
        } = await supabaseBrowserClient.auth.getUser();
        set({ user: userData });
      },
    }),
    // For Persisting Global Data State (Local Storage)
    {
      name: "user", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => userStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export default useUserStore;
