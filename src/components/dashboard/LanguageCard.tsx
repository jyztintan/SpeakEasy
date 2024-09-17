import { Card, CardContent } from "@/components/ui/card";
import { Scenario } from "./Home";

export default function LanguageCard({ scenario }: { scenario: Scenario }) {
  return (
    <a href={`/dashboard/scenario?id=${scenario.scenario_id}`}>
      <Card className="w-80 overflow-hidden">
        <div className="overflow-hidden">
          <img
            src={scenario.image}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4 text-left">
          <h2 className="text-xl font-semibold mb-1">{scenario.name}</h2>
          <p className="text-sm text-muted-foreground">{scenario.context}</p>
        </CardContent>
      </Card>
    </a>
  );
}
