import { createContext, useContext, useEffect, useState } from "react";
import { CredentialResponse, googleLogout } from "@react-oauth/google";

import { ReactNode } from "react";

type userAuthType = {
  user: string;
  setUser: (user: string) => void;
  logOut: () => void;
  logIn: (response: CredentialResponse) => void;
};

const UserAuthContext = createContext<userAuthType>({
  user: "",
  setUser: () => {},
  logOut: () => {},
  logIn: () => {},
});

export function UserAuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState("");

  const logIn = (response: CredentialResponse) => {
    // console.log(response);
    const credential = JSON.stringify(response.credential);
    localStorage.setItem("SpeakEasyUser", credential);
    localStorage.setItem("user_id", "test_api_user"); // for testing purpose
    setUser(credential);
  };

  const logOut = () => {
    googleLogout();
    setUser("");
    localStorage.removeItem("SpeakEasyUser");
  };

  useEffect(() => {
    const checkUserSession = () => {
      const storedUser = localStorage.getItem("SpeakEasyUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkUserSession();
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
