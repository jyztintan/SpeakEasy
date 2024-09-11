import { Button } from "@/components/ui/button";
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { useState } from "react";

const Login = () => {
  const [isLogIn, setLogIn] = useState(false);

  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
    setLogIn(true);
  };

  const logOut = () => {
    googleLogout();
    setLogIn(false);
  };

  return (
    <>
      <GoogleLogin onSuccess={responseMessage} onError={console.log} />
      {isLogIn && (
        <Button variant="outline" onClick={logOut}>
          Logout
        </Button>
      )}
    </>
  );
};

export default Login;
