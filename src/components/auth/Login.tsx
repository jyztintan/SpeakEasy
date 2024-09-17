import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";

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
