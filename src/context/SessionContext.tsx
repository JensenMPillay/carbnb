"use client";
import { Session } from "@supabase/supabase-js";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabaseBrowserClient } from "../lib/supabase/supabase-browser-client";

type SessionContextProps = {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
};

const initialSessionContext: SessionContextProps = {
  session: null,
  setSession: () => {},
};

const SessionContext = createContext<SessionContextProps>(
  initialSessionContext,
);

export const useSessionContext = () => useContext(SessionContext);

export const SessionContextProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session | null>(null);

  const getSession = useCallback(async () => {
    const {
      data: { session: sessionData },
      error,
    } = await supabaseBrowserClient.auth.getSession();
    setSession(sessionData);
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);

  const contextValue = useMemo(
    () => ({ session, setSession }),
    [session, setSession],
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
