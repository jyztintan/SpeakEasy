import { Badge } from "@/components/ui/badge";
import { Button, LoadingButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { apiUrl } from "@/main";
import { AudioLines, HelpCircle, Mic, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  utterance?: SpeechSynthesisUtterance;
};

export type Suggestion = {
  text: string;
  translated_text: string;
  utterance: SpeechSynthesisUtterance;
};

export function readAloud(utterance: SpeechSynthesisUtterance): void {
  utterance.lang = "zh-CN";
  const synth: SpeechSynthesis = window.speechSynthesis;
  synth.speak(utterance);
}

export function cancelReading(): void {
  const synth: SpeechSynthesis = window.speechSynthesis;
  synth.cancel();
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
      translated_text: scenario.translated_first_message,
      utterance: new SpeechSynthesisUtterance(scenario.first_message),
    },
  ]);
  const [userInputs, setUserInputs] = useState("");
  const [latestResponse, setLatestResponse] = useState<string>(
    scenario.first_message
  );
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [commentIdx, setCommentIdx] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when messages are updated
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    // For Firefox browser
    alert("Speech recognition is not supported in this browser.");
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "zh-CN";

  recognition.onresult = (event) => {
    if (isSpeaking) {
      setIsSpeaking(false);
    }
    const text = event.results[0][0].transcript;
    // add user's text to the conversation
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: text },
    ]);

    // fetch AI's response and add to the conversation
    const inputs = userInputs + text;
    setUserInputs(inputs);
    getResponse(inputs).then((res) => {
      const message = {
        ...res,
        utterance: new SpeechSynthesisUtterance(res.text),
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setLatestResponse(res.text);
      readAloud(message.utterance);
      setSuggestions([]);
    });
  };

  recognition.onend = () => {
    setIsSpeaking(false);
  };

  recognition.onerror = (event) => {
    if (event.error === "no-speech") {
      alert("No speech detected.");
    } else {
      alert(event.error);
    }
    setIsSpeaking(false);
  };

  async function handleRecord() {
    setIsSpeaking(true);
    recognition.start();
  }

  async function getResponse(text: string): Promise<ConversationResponse> {
    setIsLoading(true);
    const body = {
      user_id: user_id,
      scenario_id: scenario.scenario_id,
      context_text: scenario.context,
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

  async function getSuggestions(): Promise<void> {
    const body = {
      user_id: user_id,
      scenario_id: scenario.scenario_id,
      context_text: scenario.context,
      prev_gpt_message: latestResponse,
    };

    const response = await fetch(`${apiUrl}/api/v1/get-help/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const res = await response.json();
    let suggestions: Suggestion[] = res["suggestions"];
    suggestions = suggestions.map<Suggestion>((suggestion) => {
      return {
        ...suggestion,
        utterance: new SpeechSynthesisUtterance(suggestion.text),
      };
    });
    setSuggestions(suggestions);
  }


  async function getFeedback(text: string): Promise<void> {
    const body = {
      user_id: user_id,
      scenario_id: scenario.scenario_id,
      context_text: scenario.context,
      user_text: text,
    };

    const response = await fetch(`${apiUrl}/api/v1/feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    setFeedbackText(json.text);
  }


  // might be called twice in dev mode, but only once in prod mode due to StrictMode,
  // read here: https://www.dhiwise.com/post/resolving-useeffect-running-twice-a-comprehensive-guide
  useEffect(() => {
    readAloud(messages[0].utterance as SpeechSynthesisUtterance);
  }, []);

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex flex-col space-y-4 items-start p-4 w-full h-[90%]">
        <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0 w-full h-full">
          <Card className="flex flex-col md:basis-3/5 items-center justify-center">
            <CardContent
              ref={messageContainerRef}
              className="basis-11/12 w-full p-6 space-y-4 min-h-[600px] overflow-y-auto"
            >
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
                    utterance={message.utterance}
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
                  Return To Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex basis-1/12 space-x-4 py-4 items-center">
                {isSpeaking == true ? (
                  <Button className="rounded-full text-black bg-white" disabled>
                    Recording audio... &nbsp;
                    <AudioLines size={18} />
                  </Button>
                ) : (
                  <>
                    <Button className="rounded-full" onClick={handleRecord}>
                      Speak &nbsp;
                      <Mic size={16} />
                    </Button>
                    <Button
                      variant="secondary"
                      className="bg-red-500 hover:bg-red-600 hover:border-red-600 text-white rounded-full"
                      onClick={() => {
                        setIsEnded(true);
                        getFeedback(userInputs);
                      }}
                    >
                      End &nbsp;
                      <X size={16} />
                    </Button>
                  </>
                )}
              </div>
            )}
          </Card>
          <Card className="flex flex-col md:basis-2/5 space-y-4 pb-6">
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
                        )}{" "}
                        / 100
                      </Badge>
                    </div>
                    <div className="flex space-x-8">
                      <p>
                        {feedbackText}
                      </p>
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
                        <p>
                          Click on a the 'Show Feedback' button of each message to
                          view the specific improvements for that message.
                        </p>
                    )}
                  </div>
              ) : (
                  <div className="flex flex-col space-y-2 text-left">
                  {suggestions.length === 0 ? (
                    <div className="flex flex-col space-y-4 items-center">
                      <p className="text-sm">
                        Unsure of what to reply? Click here to get some
                        suggestions!
                      </p>
                      <LoadingButton
                        className="flex items-center space-x-2"
                        size="sm"
                        variant="secondary"
                        onClick={async () => {
                          setIsLoadingSuggestions(true);
                          await getSuggestions();
                          setIsLoadingSuggestions(false);
                        }}
                        loading={isLoadingSuggestions}
                      >
                        {isLoadingSuggestions || (
                          <HelpCircle className="w-4 h-4 mr-1" />
                        )}
                        Get Help
                      </LoadingButton>
                    </div>
                  ) : (
                    <h3 className="text-lg font-semibold">Suggested Replies</h3>
                  )}
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <SuggestedReply
                        key={index}
                        message={suggestion}
                        utterance={suggestion.utterance}
                      />
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
