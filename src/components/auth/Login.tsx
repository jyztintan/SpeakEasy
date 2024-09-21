import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";

const Login = () => {
  const { logIn, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await logIn();
      if (user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // If user is already logged in, navigate to the dashboard automatically
  if (user) {
    navigate("/dashboard");
  }

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
