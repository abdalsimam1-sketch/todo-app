import React, { useState, createContext, useContext, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

interface AuthContextTypes {
  user: User | null;
  session: Session | null;
  loading: boolean;
}
const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const valuesToBeShared: AuthContextTypes = { user, session, loading };
  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error.message);
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    getInitialSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={valuesToBeShared}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextTypes => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("use auth must be within an AuthProvider ");
  }

  return context;
};
