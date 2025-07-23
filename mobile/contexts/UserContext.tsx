import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config/firebaseConfig";
import { AuthService } from "@/services/auth.service";
import { User, UserRole } from "@/types/user.types";

interface UserContextProps {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  user: User | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user?: User; error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextProps>({
  role: null,
  setRole: () => {},
  user: null,
  signIn: async () => ({ error: "Not implemented" }),
  signOut: async () => {},
  loading: false,
  isAuthenticated: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        try {
          // Get user data from Firestore using your service
          const currentUser = await AuthService.getCurrentUser();

          if (currentUser) {
            setUser(currentUser);
            setRole(currentUser.role);
            setIsAuthenticated(true);
          } else {
            // Firebase user exists but no Firestore document
            setUser(null);
            setRole(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { user: authenticatedUser, error } = await AuthService.signIn(
        email,
        password
      );

      if (error) {
        return { error };
      }

      if (authenticatedUser) {
        setUser(authenticatedUser);
        setRole(authenticatedUser.role);
        setIsAuthenticated(true);
        return { user: authenticatedUser };
      }

      return { error: "Authentication failed" };
    } catch (error: any) {
      console.error("Sign in error 2:", error);
      return { error: error.message || "Authentication failed" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);

    try {
      const { error } = await AuthService.signOut();

      if (error) {
        console.error("Sign out error:", error);
      }

      // Clear local state
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        role,
        setRole,
        user,
        signIn,
        signOut,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
