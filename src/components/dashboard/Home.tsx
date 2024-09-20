import Navbar from "@/components/navigation/Navbar";
import LanguageCard from "./LanguageCard";
import { useEffect, useState } from "react";

export type Scenario = {
  scenario_id: number;
  name: string;
  image: string;
  context: string;
  first_message: string;
};

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function HomePage() {
  const user_id = localStorage.getItem("user_id");
  const [cardData, setCardData] = useState<Scenario[]>([]);

  async function fetchScenarios(): Promise<Scenario[]> {
    try {
      const response = await fetch(`${apiUrl}/api/v1/scenarios/${user_id}`);
      const json = await response.json();
      const scenarios: Scenario[] = json["scenarios"];
      return scenarios;
    } catch (err) {
      console.error("Error fetching scenario: ", err);
      return [];
    }
  }

  useEffect(() => {
    fetchScenarios().then((scenarios) => {
      console.log(scenarios);
      setCardData(scenarios);
    });
  }, []);

  return (
    <div className="min-h-screen w-screen">
      <Navbar />
      <div className="flex flex-col space-y-8 items-start p-4 w-full">
        <div className="flex flex-col w-full space-y-6 items-start">
          <h1 className="text-3xl font-bold">My Scenarios</h1>
          <div className="flex space-x-4 w-full overflow-auto pb-4">
            {cardData.map((scenario) => (
              <LanguageCard key={scenario.scenario_id} scenario={scenario} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
