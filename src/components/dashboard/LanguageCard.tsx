import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Scenario } from "./Home";

export default function LanguageCard({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate();

  const directToScenario = () => {
    navigate(`/dashboard/scenario?id=${scenario.scenario_id}`, {
      state: { scenario },
    });
  };

  return (
    <div className="cursor-pointer" onClick={directToScenario}>
      <Card className="pb-4 hover:bg-slate-100">
        <div className="overflow-hidden">
          <img
            src={scenario.image}
            alt="Thumbnail"
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="h-28 p-4 pb-0 text-left overflow-auto">
          <h2 className="text-xl font-semibold mb-1">{scenario.name}</h2>
          <p className="text-sm text-muted-foreground">{scenario.context}</p>
        </CardContent>
      </Card>
    </div>
  );
}
