import { Button, LoadingButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Languages, MessagesSquare, Volume2 } from "lucide-react";
import { useState } from "react";
import { ConversationResponse, readAloud } from "./Conversation";

export default function Message({
  message,
  isEnded,
  getSuggestions,
  showComment,
}: {
  message: ConversationResponse;
  isEnded: boolean;
  getSuggestions: (text: string) => Promise<void>;
  showComment: () => void;
}) {
  const [textDisplay, setTextDisplay] = useState<string>(message.text);
  const [isLoading, setIsLoading] = useState(false);

  function toggleTranslation(): void {
    setTextDisplay(
      textDisplay == message.text
        ? (message.translated_text as string)
        : message.text
    );
  }

  return (
    <Card
      className="max-w-[425px] border-0"
      style={{
        backgroundColor: message.role === "assistant" ? "#FBF9FF" : "#FFF8F8",
      }}
    >
      <CardContent className="p-4 text-left">
        {message.role === "assistant" && !isEnded && (
          <div className="flex space-x-2 mb-2">
            <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={toggleTranslation}
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
            <LoadingButton
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={async () => {
                setIsLoading(true);
                await getSuggestions(message.text);
                setIsLoading(false);
              }}
              loading={isLoading}
            >
              {isLoading || <HelpCircle className="w-4 h-4 mr-1" />}
              Get Help
            </LoadingButton>
          </div>
        )}
        {message.role === "user" && isEnded && (
          <div className="flex space-x-2 mb-2">
            <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={showComment}
            >
              <MessagesSquare className="w-4 h-4 mr-1" />
              Show Feedback
            </Button>
          </div>
        )}
        <p>{textDisplay}</p>
      </CardContent>
    </Card>
  );
}
