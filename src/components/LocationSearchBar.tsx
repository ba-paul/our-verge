import { Search, MapPin, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface LocationSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGetLocation: () => void;
  userLocation: {lat: number, lng: number} | null;
  nearbyRadius: number;
  onRadiusChange: (radius: number) => void;
}

export function LocationSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onGetLocation, 
  userLocation, 
  nearbyRadius, 
  onRadiusChange 
}: LocationSearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
        <div className="flex items-center">
          {/* Location Search */}
          <div className="flex-1 px-6">
            <Input
              type="text"
              placeholder="Search gardens by name, location, or type..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 p-0 bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>

          {/* Current Location Button */}
          <Button
            variant="ghost"
            className="mx-2 rounded-full p-3 hover:bg-gray-100"
            onClick={onGetLocation}
            title={userLocation ? "Location found" : "Find my location"}
          >
            <Navigation className={`h-4 w-4 ${userLocation ? 'text-green-600' : 'text-gray-600'}`} />
          </Button>

          {/* Search/Clear Button */}
          <Button 
            className="mr-2 rounded-full bg-green-600 hover:bg-green-700 p-3"
            onClick={() => {
              if (searchQuery) {
                onSearchChange("");
              }
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Nearby Radius Selector */}
      {userLocation && (
        <div className="mt-3 mt-2 p-2 flex items-center justify-center gap-3 border border-gray-200 rounded-full">
          <span className="text-sm text-white text-gray-600">Show gardens within:</span>
          <select
            value={nearbyRadius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={1}>1 km</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={20}>20 km</option>
          </select>
          <span className="text-sm text-white">of your location</span>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}