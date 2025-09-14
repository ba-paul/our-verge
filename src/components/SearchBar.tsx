import { Search, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function SearchBar() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-full shadow-lg border border-gray-200 p-2">
      <div className="flex items-center divide-x divide-gray-200">
        {/* Location */}
        <div className="flex-1 px-6 py-3">
          <label className="block text-xs uppercase tracking-wide text-gray-700 mb-1">
            Where
          </label>
          <Input
            type="text"
            placeholder="Search destinations"
            className="border-0 p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>

        {/* Check-in */}
        <div className="flex-1 px-6 py-3">
          <label className="block text-xs uppercase tracking-wide text-gray-700 mb-1">
            Check in
          </label>
          <Input
            type="text"
            placeholder="Add dates"
            className="border-0 p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>

        {/* Check-out */}
        <div className="flex-1 px-6 py-3">
          <label className="block text-xs uppercase tracking-wide text-gray-700 mb-1">
            Check out
          </label>
          <Input
            type="text"
            placeholder="Add dates"
            className="border-0 p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0"
          />
        </div>

        {/* Guests */}
        <div className="flex-1 px-6 py-3 flex items-center justify-between">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-700 mb-1">
              Who
            </label>
            <Input
              type="text"
              placeholder="Add guests"
              className="border-0 p-0 text-sm placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>
          <Button className="ml-3 rounded-full bg-red-500 hover:bg-red-600 p-3">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}