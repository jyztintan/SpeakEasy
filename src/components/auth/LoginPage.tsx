import Login from "./Login";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const termsOfService = `
Effective Date: 22nd Sept 2024

Welcome to SpeakEasy! By using our app, you agree to the following terms and conditions. Please read them carefully.

1. Acceptance of Terms
By accessing or using SpeakEasy (the "App"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the App.

2. Use of the App
Eligibility: You must be at least 13 years old to use the App. If you are under 18, you may only use the App under the supervision of a parent or guardian.
License: We grant you a limited, non-exclusive, non-transferable, and revocable license to use the App for personal, non-commercial purposes.

3. User Responsibilities
You agree to use the App only for lawful purposes and in a way that does not infringe on the rights of others.
You must not upload or share any offensive, harmful, or inappropriate content through the App.

4. AI-Generated Content
The App leverages AI to generate conversation scenarios and learning content. While we strive to provide accurate and helpful content, we make no guarantees regarding the accuracy, completeness, or reliability of AI-generated material. SpeakEasy is not responsible for any misunderstandings or errors arising from AI-generated content.

5. Changes to the Terms
We may update these Terms from time to time. Any changes will be posted within the App, and your continued use constitutes acceptance of the revised Terms.

6. Governing Law
These Terms are governed by the laws of Singapore.
`;

const privacyPolicy = `
Effective Date: 22nd Sept 2024

At SpeakEasy, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.

1. Information We Collect
- Account Information: When you sign up, we collect basic information such as your name and email address.
- Usage Data: We may collect data on how you interact with the app (e.g., learning progress, conversations) to improve your experience.

2. How We Use Your Information
- To provide and improve the App's functionality.
- To personalize your learning experience.
- To send important updates or promotional offers (you can opt-out anytime).
- To analyze app usage for improvement and troubleshooting.

3. Data Sharing
We do not sell or share your personal information with third parties, except:
- To comply with legal obligations.
- With service providers who help us operate the App (e.g., hosting providers).
- In the event of a merger or acquisition, your data may be transferred to a new entity.

4. Data Security
We take reasonable steps to protect your personal information from unauthorized access, loss, or misuse. However, no method of transmission over the Internet is completely secure.

5. Your Rights
You can request the deletion of your account and personal data at any time by contacting us.
`;

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
            <Dialog>
              <DialogTrigger asChild>
                <a className="text-[#8C52FF] underline hover:text-[#FF3131]">
                  Terms of Service
                </a>
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-auto mt-10 w-[300px] h-[400px] md:w-[700px] md:h-[600px]">
                <DialogHeader>
                  <DialogTitle>Terms of Service</DialogTitle>
                  <DialogDescription className="whitespace-pre-wrap">
                    {termsOfService}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>{" "}
            and{" "}
            <Dialog>
              <DialogTrigger asChild>
                <a className="text-[#8C52FF] underline hover:text-[#FF3131]">
                  Privacy Policy
                </a>
              </DialogTrigger>
              <DialogContent className="max-h-screen overflow-y-auto mt-10 w-[300px] h-[400px] md:w-[700px] md:h-[600px]">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription className="whitespace-pre-wrap">
                    {privacyPolicy}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
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
