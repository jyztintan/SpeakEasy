import Navbar from "@/components/navigation/Navbar";
import LanguageCard from "./LanguageCard";

export default function HomePage() {
  const cardData = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className="min-h-screen w-screen">
      <Navbar />
      <div className="flex flex-col space-y-8 items-start p-4 w-full">
        <div className="flex flex-col w-full space-y-6 items-start">
          <h2 className="font-semibold text-2xl">My Scenarios</h2>
          <div className="flex space-x-4 w-full overflow-auto pb-4">
            {cardData.map((card) => (
              <LanguageCard key={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
