import { Search, MapPin, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function LocationSearchBar() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-full shadow-lg border border-gray-200 p-2">
      <div className="flex items-center">
        {/* Location Search */}
        <div className="flex-1 px-6">
          <Input
            type="text"
            placeholder="Find green verges nearby"
            className="border-0 p-0 bg-transparent text-sm placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>

        {/* Current Location Button */}
        <Button
          variant="ghost"
          className="mx-2 rounded-full p-3 hover:bg-gray-100"
        >
          <Navigation className="h-4 w-4 text-gray-600" />
        </Button>

        {/* Search Button */}
        <Button className="mr-2 rounded-full bg-green-600 hover:bg-green-700 p-3">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}