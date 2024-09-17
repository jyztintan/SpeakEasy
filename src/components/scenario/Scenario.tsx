import { useSearchParams } from "react-router-dom";
import { Scenario } from "../dashboard/Home";
import Navbar from "../navigation/Navbar";
import { Button } from "../ui/button";

export default function ScenarioPage() {
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
  return (
    <div className="min-h-screen w-screen">
      <Navbar />
      <div className="flex flex-col space-y-4 items-start p-4 w-full">
        <div className="relative w-full h-96">
          <img
            src={scenario.image}
            alt="Scenario Banner"
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <a href={`/dashboard/conversation?id=${scenario_id}`}>
              <Button
                variant="default"
                className="z-10 text-lg font-semibold"
                size="lg"
              >
                Practice Now
              </Button>
            </a>
          </div>
        </div>
        <div className="text-left space-y-2">
          <h1 className="text-3xl font-bold">{scenario.name}</h1>
          <p className="text-muted-foreground text-lg sm:text-xl">
            {scenario.context}
          </p>
        </div>
      </div>
    </div>
  );
}
