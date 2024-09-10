import React from "react";
import Login from "./Login";

const LoginPage = () => {
  return (
    <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
      <div className="flex bg-black rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-white text-4xl font-semibold mb-4">SpeakEasy</h1>
          <blockquote className="text-gray-400 italic">
            “Best language learning application on the market! Worth every
            penny! I started not knowing a single thing about Chinese and now I
            can order from the hawker stalls with ease.”
          </blockquote>
          <p className="mt-4 text-white">— John Cena</p>
        </div>
        {/* Right Section */}
        <div className="w-1/2 bg-gray-800 p-24 flex flex-col justify-center items-center ">
          <h2 className="text-white text-4xl font-semibold mb-6">Login</h2>
          <Login />
          <p className="text-gray-400 text-sm mt-4 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-white">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
