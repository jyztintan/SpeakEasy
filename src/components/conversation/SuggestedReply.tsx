import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Volume2 } from "lucide-react";
import { Suggestion, readAloud } from "./Conversation";

export default function SuggestedReply({message} : {message : Suggestion}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-2 mb-2">
          <Button
            className="flex items-center space-x-2"
            size="sm"
            variant="secondary"
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
          {message.text}
        </p>
      </CardContent>
    </Card>
  );
}
