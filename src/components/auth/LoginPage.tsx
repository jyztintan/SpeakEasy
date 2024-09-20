import Login from "./Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row">
      <div className="md:basis-1/2 flex flex-col items-start p-4">
        <div>
          <a href="/" className="text-2xl font-bold">
            <img src="/logo.svg" alt="logo" className="h-10" />
          </a>
          <span className="sr-only">SpeakEasy</span>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center space-y-8 mx-auto py-16 md:py-0">
          <div className="flex flex-col space-y-4">
            <h2 className="text-4xl font-bold">
              Login and Start Learning Today!
            </h2>
            <h2 className="text-2xl font-bold">立即登录并开始学习！</h2>
          </div>
          <Login />
          <p className="text-sm mt-4 text-center w-3/4">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="text-[#8C52FF] underline hover:text-[#FF3131]"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-[#8C52FF] underline hover:text-[#FF3131]"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
      <div className="md:basis-1/2 flex flex-col space-y-8 items-center justify-center bg-[#8C52FF] text-white py-16 md:py-0">
        <blockquote className="text-xl font-semibold italic w-2/3">
          “Best language learning application on the market! Worth every penny!
          I started not knowing a single thing about Chinese and now I can order
          from the hawker stalls with ease.”
        </blockquote>
        <p className="text-lg font-medium">— John Cena</p>
      </div>
    </div>
  );
};

export default LoginPage;
