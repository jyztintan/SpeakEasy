import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Languages, Volume2 } from "lucide-react";
import { ConversationResponse, readAloud } from "./Conversation";

export default function Message({
  message, showSuggestions
}: {
  message: ConversationResponse; showSuggestions: (text: string) => void
}) {
  return (
    <Card className="max-w-[425px]">
      <CardContent className="p-4 text-left">
        {message.role === "assistant" && (
          <div className="flex space-x-2 mb-2">
            <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
            >
              <Languages className="w-4 h-4 mr-1" />
              See Translation
            </Button>
            <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={() => readAloud(message.text)}
            >
              <Volume2 className="w-4 h-4 mr-1" />
              Read Aloud
            </Button>
            <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={() => showSuggestions(message.text)}
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              Get Help
            </Button>
          </div>
        )}
        <p>{message.text}</p>
      </CardContent>
    </Card>
  );
}
