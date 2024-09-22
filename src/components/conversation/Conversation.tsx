import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiUrl } from "@/main";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Mic, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Scenario } from "../dashboard/Home";
import Navbar from "../navigation/Navbar";
import Message from "./Message";
import SuggestedReply from "./SuggestedReply";

export type ConversationResponse = {
  role: "assistant" | "user";
  text: string;
  translated_text?: string;
  feedback?: string;
  score?: number;
};

export type Suggestion = {
  text: string;
  translated_text: string;
};

export function readAloud(text: string): void {
  const synth: SpeechSynthesis = window.speechSynthesis;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";

  synth.speak(utterance);
}

export default function ConversationPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("SpeakEasyUser") as string);
  const user_id = user["uid"];

  const location = useLocation();
  const { scenario } = location.state as { scenario: Scenario };

  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ConversationResponse[]>([
    {
      role: "assistant",
      text: scenario.first_message,
      translated_text: "Translated text",
    },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [commentIdx, setCommentIdx] = useState(0);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    // For Firefox browser
    alert("Speech recognition is not supported in this browser.");
  }
  const recognition = new SpeechRecognition();

  recognition.lang = "zh-CN";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const text: string = event.results[0][0].transcript;
    // add user's text to the conversation
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: text },
    ]);

    // fetch AI's response and add to the conversation
    getResponse(text).then((res) => {
      setMessages((prevMessages) => [...prevMessages, res]);
      readAloud(res.text);
      setSuggestions([]);
    });
  };

  recognition.onerror = (event) => {
    if (event.error === "no-speech") {
      console.log("No speech detected.");
    } else {
      console.error("Speech recognition error: ", event.error);
    }
  };

  function handleRecord() {
    recognition.start();
  }

  async function getResponse(text: string): Promise<ConversationResponse> {
    setIsLoading(true);
    const body = {
      user_id: user_id,
      scenario_id: scenario.scenario_id,
      user_text: text,
    };

    const response = await fetch(`${apiUrl}/api/v1/text/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    const msg: ConversationResponse = { ...json, role: "assistant" };
    setIsLoading(false);
    return msg;
  }

  async function getSuggestions(text: string): Promise<void> {
    const body = {
      user_id: user_id,
      scenario_id: scenario.scenario_id,
      prev_gpt_message: text,
    };

    const response = await fetch(`${apiUrl}/api/v1/get-help/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const res = await response.json();
    const suggestions: Suggestion[] = res["suggestions"];
    setSuggestions(suggestions);
  }

  // might be called twice in dev mode, but only once in prod mode due to StrictMode,
  // read here: https://www.dhiwise.com/post/resolving-useeffect-running-twice-a-comprehensive-guide
  useEffect(() => {
    readAloud(messages[0]["text"]);
  }, []);

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col space-y-4 items-start p-4 w-full h-[90%]">
        <div className="flex space-x-6 w-full h-full">
          <Card className="flex flex-col basis-3/5 items-center justify-center">
            <CardContent className="basis-11/12 w-full p-6 space-y-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  className="flex w-full"
                  style={{
                    justifyContent:
                      message.role === "assistant" ? "flex-start" : "flex-end",
                  }}
                >
                  <Message
                    key={index}
                    message={message}
                    isEnded={isEnded}
                    getSuggestions={getSuggestions}
                    showComment={() => {
                      setCommentIdx(index);
                    }}
                  />
                </div>
              ))}
              {isLoading && (
                <div className="flex space-x-1 items-center">
                  <span className="sr-only">Loading...</span>
                  <div className="size-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="size-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="size-2 bg-black rounded-full animate-bounce"></div>
                </div>
              )}
            </CardContent>
            {isEnded ? (
              <div className="py-4">
                <Button onClick={() => navigate("/dashboard")}>
                  Return Back
                </Button>
              </div>
            ) : (
              <div className="flex basis-1/12 space-x-4 py-4">
                <Button className="size-12 rounded-full" onClick={handleRecord}>
                  <Mic size={16} />
                </Button>
                <Button
                  variant="secondary"
                  className="size-12 rounded-full"
                  onClick={() => setIsEnded(true)}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
          </Card>
          <Card className="flex flex-col basis-2/5 space-y-4 pb-6">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={scenario.image}
                  alt="Scenario Image"
                  className="rounded-t-lg h-48 object-cover hover:cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent>
                <img
                  src={scenario.image}
                  alt="Scenario Image"
                  className="rounded-t-lg hover:cursor-pointer p-10"
                />
              </DialogContent>
            </Dialog>
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
              <div className="flex flex-col space-y-2 text-left">
                <h2 className="text-xl font-semibold">{scenario.name}</h2>
                <p className="mb-4">{scenario.context}</p>
              </div>
              <Separator />
              {isEnded ? (
                <div className="flex flex-col space-y-2 text-left">
                  <h3 className="text-lg font-semibold">
                    Conversation Feedback
                  </h3>
                  <div className="flex space-x-8">
                    <p>Average Score</p>
                    <Badge>
                      {Math.round(
                        messages.reduce((prev, curr) => {
                          if (curr.score) {
                            return curr.score + prev;
                          } else {
                            return prev;
                          }
                        }, 0) /
                          (messages.length / 2)
                      )} / 100
                    </Badge>
                  </div>
                  <h4 className="font-semibold mt-4">Individual Comment</h4>
                  {commentIdx % 2 === 1 ? (
                    <div className="space-y-2">
                      <p className="italic text-sm">
                        "{messages[commentIdx].text}"
                      </p>
                      <p>{messages[commentIdx + 1].feedback}</p>
                    </div>
                  ) : (
                    <p>Click on a message to show feedback</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col space-y-2 text-left">
                  <h3 className="text-lg font-semibold">Suggested Replies</h3>
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <SuggestedReply key={index} message={suggestion} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
