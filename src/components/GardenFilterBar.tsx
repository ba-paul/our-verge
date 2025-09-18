import React from "react";
import {
  SlidersHorizontal,
  Leaf,
  Droplets,
} from "lucide-react";
import { Button } from "./ui/button";

const filters = [
  { name: "All Gardens", icon: null, value: "all" as const },
  { name: "Verge Gardens", icon: Leaf, value: "VG" as const },
  { name: "Bioswales", icon: Droplets, value: "BS" as const },
];

interface GardenFilterBarProps {
  activeFilter: "all" | "VG" | "BS";
  onFilterChange: (filter: "all" | "VG" | "BS") => void;
}

export function GardenFilterBar({ activeFilter, onFilterChange }: GardenFilterBarProps) {
  return (
    <div className="flex items-center gap-6 px-6 py-4 border-b bg-white">
      {/* Filter chips */}
      <div className="flex gap-3 items-center">
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.name}
              onClick={() => onFilterChange(filter.value)}
              className={`flex items-center gap-1 min-w-fit transition-colors group px-3 py-2 rounded-full ${
                isActive 
                  ? "text-green-700 bg-green-50 border border-green-200" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
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