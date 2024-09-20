import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Volume2 } from "lucide-react";
import { Suggestion, readAloud } from "./Conversation";
import { useState } from "react";


export default function SuggestedReply({message} : {message : Suggestion}) {
  const [textDisplay, setTextDisplay] = useState<string>(message.text);

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
          <Button
            className="flex items-center space-x-2"
            size="sm"
            variant="secondary"
            onClick={() => readAloud(message.text)}
          >
            <Volume2 size={12} />
            <span>Read Aloud</span>
          </Button>
        </div>
        <p>
          {textDisplay}
        </p>
      </CardContent>
    </Card>
  );
}
