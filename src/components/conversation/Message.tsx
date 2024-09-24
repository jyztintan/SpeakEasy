import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, MessagesSquare, Volume2, VolumeX } from "lucide-react";
import { useState} from "react";
import { cancelReading, ConversationResponse, readAloud } from "./Conversation";

export default function Message({
  message,
  isEnded,
  showComment,
  utterance
}: {
  message: ConversationResponse;
  isEnded: boolean;
  getSuggestions: (text: string) => Promise<void>;
  showComment: () => void;
  utterance: SpeechSynthesisUtterance | undefined;
}) {
  const [textDisplay, setTextDisplay] = useState<string>(message.text);
  const [isReading, setIsReading] = useState(false);

  if (utterance) {
    utterance.onstart = () => {
      setIsReading(true);
    }

    utterance.onend = () => {
      setIsReading(false);
    };
  }

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
        {message.role === "assistant" && !isEnded && utterance && (
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
            {isReading == true ? (
              <Button
                className="flex items-center space-x-2"
                size="sm"
                variant="secondary"
                onClick={() => {setIsReading(false); cancelReading(); }}
              >
                <VolumeX className="w-4 h-4 mr-1" />
                Mute 
              </Button>
            ) : (
              <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={() => {setIsReading(true); readAloud(utterance); }}
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Read Aloud
              </Button>) 
              }
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
