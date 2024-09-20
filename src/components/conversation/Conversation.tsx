import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
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

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function ConversationPage() {
  /** 
  const [searchParams] = useSearchParams();
  const scenario_id = searchParams.get("id");
  */

  const location = useLocation();
  const { scenario } = location.state as { scenario: Scenario };

  const [messages, setMessages] = useState<ConversationResponse[]>([
    {
      role: "assistant",
      text: scenario.first_message,
      translated_text: "Translated text",
    },
  ]);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
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

  function showSuggestions(text: string): void {
    getSuggestions(text).then((suggestions) => setSuggestions(suggestions));
  }

  async function getResponse(text: string): Promise<ConversationResponse> {
    const body = {
      user_id: localStorage.getItem("user_id"),
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
    return msg;
  }

  async function getSuggestions(text: string): Promise<Suggestion[]> {
    const body = {
      user_id: localStorage.getItem("user_id"),
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
    return suggestions;
  }

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
                    showSuggestions={showSuggestions}
                  />
                </div>
              ))}
            </CardContent>
            <div className="flex basis-1/12 space-x-4 py-4">
              <Button className="size-12 rounded-full" onClick={handleRecord}>
                <Mic size={16} />
              </Button>
              <Button variant="secondary" className="size-12 rounded-full">
                <X size={16} />
              </Button>
            </div>
          </Card>
          <Card className="flex flex-col basis-2/5 space-y-4 pb-6">
            <img
              src={scenario.image}
              alt="Scenario Image"
              className="rounded-t-lg h-48 object-cover"
            />
            <CardContent className="flex-1 space-y-4 overflow-y-auto">
              <div className="flex flex-col space-y-2 text-left">
                <h2 className="text-xl font-semibold">{scenario.name}</h2>
                <p className="mb-4">{scenario.context}</p>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 text-left">
                <h3 className="text-lg font-semibold">Suggested Replies</h3>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <SuggestedReply key={index} message={suggestion} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
