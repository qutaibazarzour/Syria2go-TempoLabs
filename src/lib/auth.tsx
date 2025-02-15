import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "./types";

type AuthContextType = {
  updateUser: (user: UserProfile) => void;
  session: Session | null;
  user: UserProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data: userData } = await supabase
      .from("users")
      .select(
        `
        *,
        verifications:user_verifications(*),
        reviews:reviews(reviewer_id, rating, comment, created_at),
        properties:properties(*)
      `,
      )
      .eq("id", userId)
      .single();
    return userData;
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const userData = await fetchUserProfile(session.user.id);
        setUser(userData || session.user);
      } else {
        setUser(null);
      }
      setSession(session);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userData = await fetchUserProfile(session.user.id);
        setUser(userData || session.user);
      } else {
        setUser(null);
      }
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
      );
      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create the user profile
        const { error: profileError } = await supabase.from("users").upsert({
          id: authData.user.id,
          email: email,
          legal_name: fullName,
          username: fullName.split(" ")[0], // Default username to first name
          photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          about_intro: "Hello! I love traveling and meeting new people.",
          languages: ["English"],
          created_at: new Date().toISOString(),
        });
        if (profileError) throw profileError;

        // Create verification record
        const { error: verificationError } = await supabase
          .from("user_verifications")
          .insert({
            user_id: authData.user.id,
            email_verified: false,
            phone_verified: false,
            identity_verified: false,
          });
        if (verificationError) throw verificationError;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        error,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };
