import { useNavigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";
import { apiUrl } from "@/main";

async function createUser(user_id : string) {
  const body = { user_id : user_id }
  try {
    const response = await fetch(`${apiUrl}/api/v1/users/`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });
    await response.json();  // wait for backend to return
  } catch (err) {
    console.log("User has already been created");
  }
}

const Login = () => {
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
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
    }
  };

  // code doesnt work if i dont comment out the section below, still havent figured out the reason yet
  // If user is already logged in, navigate to the dashboard automatically
  // if (user) {
  //   navigate("/dashboard");
  // }

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
