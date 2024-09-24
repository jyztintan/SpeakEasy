import { LoadingButton } from "@/components/ui/button";
import { apiUrl } from "@/main";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";

async function createUser(user_id: string) {
  const body = { user_id: user_id };
  try {
    const response = await fetch(`${apiUrl}/api/v1/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    await response.json(); // wait for backend to return
  } catch (err) {
    console.log("User has already been created", err);
  }
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { logIn, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await logIn();
      const user = JSON.parse(localStorage.getItem("SpeakEasyUser") as string);
      if (user) {
        const user_id = user["uid"];
        await createUser(user_id);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, navigate to the dashboard automatically
  if (user) {
    navigate("/dashboard");
  }

  return (
    <div>
      <LoadingButton
        onClick={handleLogin}
        loading={isLoading}
        className="flex space-x-2 items-center font-medium"
      >
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
          className="size-4"
        />
        <span>Login with Google</span>
      </LoadingButton>
    </div>
  );
};

export default Login;
