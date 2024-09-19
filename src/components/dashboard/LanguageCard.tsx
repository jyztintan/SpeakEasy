import { Card, CardContent } from "@/components/ui/card";
import { Scenario } from "./Home";
import { useNavigate } from "react-router-dom";

export default function LanguageCard({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate();

  const directToScenario = () => {
    navigate(`/dashboard/scenario?id=${scenario.scenario_id}`, { state: { scenario }});
  };

  return (
    <div onClick={directToScenario}>
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
    </div>
  );
}
