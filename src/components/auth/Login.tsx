import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useUserAuth } from "./UserAuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const logInUser = (response: CredentialResponse) => {
    logIn(response);
    navigate("/dashboard");
  };

  return <GoogleLogin onSuccess={logInUser} onError={console.log} />;
};

export default Login;
