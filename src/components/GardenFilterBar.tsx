import {
  SlidersHorizontal,
  Leaf,
  Droplets,
} from "lucide-react";
import { Button } from "./ui/button";

const filters = [
  { name: "All Gardens", icon: null },
  { name: "Verge Gardens", icon: Leaf },
  { name: "Bioswales", icon: Droplets },
];

export function GardenFilterBar() {
  return (
    <div className="flex items-center gap-6 px-6 py-4 border-b bg-white">
      {/* Filter chips */}
      <div className="flex gap-3 items-center">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <button
              key={filter.name}
              className="flex items-center gap-1 min-w-fit text-gray-600 hover:text-gray-900 transition-colors group px-3 py-2 rounded-full hover:bg-gray-100"
            >
              {IconComponent && (
                <IconComponent className="h-4 w-4" />
              )}
              <span className="text-sm whitespace-nowrap">
                {filter.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}