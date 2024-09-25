import { useLocation, useNavigate } from "react-router-dom";
import { Scenario } from "../dashboard/Home";
import Navbar from "../navigation/Navbar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { apiUrl } from "@/main";

const conversationGuide = `
Welcome to your scenario! Here's how to get the most out of your conversation experience:

Start the Conversation: Click the microphone button at the bottom of the screen and start speaking in Chinese. As the conversation flows, feel free to ask questions or respond naturally!
When you stop talking, our app will recognise that and start processing your replies. Sit tight as we craft the best response for your reply!

Watch Out: When you click into the scenario, our app will start the conversation and start speaking! Don't be alarmed, this is normal and expected as per an actual conversation!
Do adjust your volume now to prevent our app from speaking too loudly!

Get Help: If you're unsure how to reply, click the Get Help button for some helpful suggested responses. You may use these suggestions to keep the conversation flowing.

Access Translation: If you need a little help, tap the Translate button to view the translation of the conversation in your native language.

Learn from Feedback: At the end of the conversation, our AI will highlight any language improvements.

Have Fun: This is your space to explore and practice! Don’t worry about making mistakes, we are here to help you learn.
`;

export default function ScenarioPage() {
  /**
  const [searchParams] = useSearchParams();
  const scenario_id = searchParams.get("id");
  */

  const location = useLocation();
  const { scenario } = location.state as { scenario: Scenario };
  const user = JSON.parse(localStorage.getItem("SpeakEasyUser") as string);
  const user_id = user["uid"];

  const navigate = useNavigate();
  function directToConversation() {
    navigate(`/dashboard/conversation?id=${scenario.scenario_id}`, {
      state: { scenario },
    });
  }

  const deleteScenario = async () => {
    const requestBody = {
      user_id: user_id,
      scenario_id: scenario.scenario_id,
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/scenarios/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-screen pb-16">
      <Navbar />
      <div className="flex flex-col space-y-4 items-start p-4 w-full">
        <div className="relative w-full h-96">
          <img
            src={scenario.image}
            alt="Scenario Banner"
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div onClick={directToConversation}>
              <Button
                variant="default"
                className="z-10 text-lg font-semibold"
                size="lg"
              >
                Practice Now
              </Button>
            </div>
          </div>
        </div>
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-bold">{scenario.name}</h1>
          <p className="text-muted-foreground text-lg sm:text-xl">
            {scenario.context}
          </p>
        </div>
        <Separator className=" bg-black" />
        <div className="text-left space-y-2 p-3 pb-8">
          <h2 className="text-2xl font-bold">Guide for Beginners</h2>
          <p className="whitespace-pre-wrap">{conversationGuide}</p>
        </div>
        <Separator className=" bg-black" />
      </div>
      <div className="pt-4 pl-8 flex flex-start">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="z-10 text-lg font-semibold"
              size="sm"
            >
              Delete Scenario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription className="p-6 text-2xl">
                Deleting this scenario is permanent and this step cannot be
                undone. Proceed with caution!
              </DialogDescription>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  className="z-10 text-lg font-semibold"
                  size="sm"
                  onClick={deleteScenario}
                >
                  Delete Scenario
                </Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
