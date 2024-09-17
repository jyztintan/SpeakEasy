import Navbar from "@/components/navigation/Navbar";
import LanguageCard from "./LanguageCard";

export type Scenario = {
  scenario_id: number;
  name: string;
  image: string;
  context: string;
  first_message: string;
};

export default function HomePage() {
  // TODO: Replace cardData with GET scenarios API
  const cardData: Scenario[] = [
    {
      scenario_id: 1,
      name: "Walk in the park",
      image: "https://placehold.co/600x400",
      context: "Take a walk at central park",
      first_message: "今天是多么美好的一天，适合散步啊，对吧?",
    },
    {
      scenario_id: 2,
      name: "Walk in the park",
      image: "https://placehold.co/600x400",
      context: "Take a walk at central park",
      first_message: "今天是多么美好的一天，适合散步啊，对吧?",
    },
  ];
  return (
    <div className="min-h-screen w-screen">
      <Navbar />
      <div className="flex flex-col space-y-8 items-start p-4 w-full">
        <div className="flex flex-col w-full space-y-6 items-start">
          <h2 className="font-semibold text-2xl">My Scenarios</h2>
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
