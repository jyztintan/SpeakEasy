import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "./config";

type userAuthType = {
  user: any;
  setUser: (user: any) => void;
  logOut: () => void;
  logIn: () => Promise<void>;
};

const UserAuthContext = createContext<userAuthType>({
  user: null,
  setUser: () => {},
  logOut: () => {},
  logIn: async () => {},
});

export function UserAuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);

  const logIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("SpeakEasyUser", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("SpeakEasyUser");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Check for user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("SpeakEasyUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem("SpeakEasyUser", JSON.stringify(firebaseUser));
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, setUser, logIn, logOut }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
