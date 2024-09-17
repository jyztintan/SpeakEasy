import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, X } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function ConversationPage() {
  const [searchParams] = useSearchParams();
  const scenario_id = searchParams.get("id");

  // TODO: GET scenario API
  const scenario: Scenario = {
    scenario_id: 2,
    name: "Walk in the park",
    image: "https://placehold.co/600x400",
    context: "Take a walk at central park",
    first_message: "今天是多么美好的一天，适合散步啊，对吧?",
  };

  const [messages, setMessages] = useState<ConversationResponse[]>([
    {
      role: "assistant",
      text: "你好！今天我能帮你做些什么？",
      translated_text: "Hello! How can I assist you today?",
    },
    {
      role: "user",
      text: "我想找一些提高生产力的建议。",
    },
    {
      role: "assistant",
      text: "当然！一个不错的建议是把任务分解成小块，一次完成一个。你试过这样做吗？",
      translated_text:
        "Sure! One good tip is to break your tasks into smaller chunks and tackle them one at a time. Have you tried that?",
      feedback: "positive",
      score: 4.5,
    },
    {
      role: "user",
      text: "是的，我以前试过，但有时还是会感到不知所措。",
    },
    {
      role: "assistant",
      text: "当然！一个不错的建议是把任务分解成小块，一次完成一个。你试过这样做吗？",
      translated_text:
        "Sure! One good tip is to break your tasks into smaller chunks and tackle them one at a time. Have you tried that?",
      feedback: "positive",
      score: 4.5,
    },
    {
      role: "user",
      text: "是的，我以前试过，但有时还是会感到不知所措。",
    },
    {
      role: "assistant",
      text: "当然！一个不错的建议是把任务分解成小块，一次完成一个。你试过这样做吗？",
      translated_text:
        "Sure! One good tip is to break your tasks into smaller chunks and tackle them one at a time. Have you tried that?",
      feedback: "positive",
      score: 4.5,
    },
    {
      role: "user",
      text: "是的，我以前试过，但有时还是会感到不知所措。",
    },
  ]);
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
                  <Message key={index} message={message} />
                </div>
              ))}
            </CardContent>
            <div className="flex basis-1/12 space-x-4 py-4">
              <Button className="size-12 rounded-full">
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
                <p className="mb-4">
                  {scenario.context} Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Eum, repellat incidunt consequuntur dolore,
                  facilis modi neque maiores ad necessitatibus sapiente
                  praesentium id tempore, totam odio veritatis fugiat nihil
                  animi quibusdam?
                </p>
              </div>
              <Separator />
              <div className="flex flex-col space-y-2 text-left">
                <h3 className="text-lg font-semibold">Suggested Replies</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <SuggestedReply key={index} />
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
