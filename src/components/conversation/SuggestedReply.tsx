import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Volume2, VolumeX } from "lucide-react";
import { Suggestion, readAloud, cancelReading } from "./Conversation";
import { useState } from "react";


export default function SuggestedReply({message, utterance} : {message : Suggestion, utterance : SpeechSynthesisUtterance}) {
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

  function toggleTranslation() : void {
    setTextDisplay(textDisplay == message.text ? message.translated_text : message.text);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-2 mb-2">
          <Button
            className="flex items-center space-x-2"
            size="sm"
            variant="secondary"
            onClick={toggleTranslation}
          >
            <Languages size={12} />
            <span>See Translation</span>
          </Button>
          {isReading ? (
              <Button
                className="flex items-center space-x-2"
                size="sm"
                variant="secondary"
                onClick={() => { setIsReading(false); cancelReading()}}
              >
                <VolumeX className="w-4 h-4 mr-1" />
                Mute 
              </Button>
            )
            : (
              <Button
              className="flex items-center space-x-2"
              size="sm"
              variant="secondary"
              onClick={() => {setIsReading(true); readAloud(utterance)}}
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Read Aloud
              </Button>)
            }
        </div>
        <p>
          {textDisplay}
        </p>
      </CardContent>
    </Card>
  );
}
