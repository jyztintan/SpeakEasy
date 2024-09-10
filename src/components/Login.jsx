import React, { useState } from "react";
import { googleLogout, GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [isLogIn, setLogIn] = useState(false);

  const responseMessage = (response) => {
    console.log(response);
    setLogIn(true);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  const logOut = () => {
    googleLogout();
    setLogIn(false);
  };

  return (
    <>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      {isLogIn && (
        <Button variant="outline" onClick={logOut}>
          Logout
        </Button>
      )}
    </>
  );
};

export default Login;
