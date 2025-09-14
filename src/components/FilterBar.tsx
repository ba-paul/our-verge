import { SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const filters = [
  "Amazing views",
  "Cabins",
  "Trending",
  "Beachfront",
  "Amazing pools",
  "Tiny homes",
  "Countryside",
  "Luxe",
  "Islands",
  "National parks",
  "Design",
  "Lakefront",
];

export function FilterBar() {
  return (
    <div className="flex items-center gap-8 px-6 py-4 border-b">
      {/* Filter chips */}
      <div className="flex gap-8 flex-1 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            className="flex flex-col items-center gap-2 min-w-fit text-gray-600 hover:text-gray-900 transition-colors group"
          >
            {/* Icon placeholder - in a real app these would be actual icons */}
            <div className="w-6 h-6 bg-gray-300 rounded-full group-hover:bg-gray-400 transition-colors"></div>
            <span className="text-xs whitespace-nowrap">{filter}</span>
          </button>
        ))}
      </div>

      {/* Filters button */}
      <Button variant="outline" className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters</span>
      </Button>
    </div>
  );
}