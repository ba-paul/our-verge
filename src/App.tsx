import React, { useState } from "react";
import { LocationSearchBar } from "./components/LocationSearchBar";
import { GardenFilterBar } from "./components/GardenFilterBar";
import { MapView } from "./components/MapView";
import { GardenCard } from "./components/GardenCard";
import { GardenDetailView } from "./components/GardenDetailView";
import logo from '../images/the-verge-logo-2.png'; 
import hero from '../images/verge-banner.jpg'; 
import gardensData from '../verges_bioswales_enriched.json';

// Use data from JSON file with proper typing
const gardens = gardensData as Array<{
  id: string;
  name: string;
  location: string;
  type: "VG" | "BS";
  imageUrl: string;
  health: "good" | "fair" | "poor";
  soilMoisture: number;
  pH: number;
  waterDepth: number;
  floodRisk: "low" | "medium" | "high";
  lat: number;
  lng: number;
  plants: Array<{
    name: string;
    scientificName: string;
    status: "healthy" | "needs-attention" | "poor";
  }>;
  comments: Array<{
    id: string;
    author: string;
    date: string;
    content: string;
    type: "maintenance" | "observation" | "concern";
  }>;
}>;

export default function App() {
  const [selectedGarden, setSelectedGarden] = useState<typeof gardens[0] | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [activeFilter, setActiveFilter] = useState<"all" | "VG" | "BS">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyRadius, setNearbyRadius] = useState<number>(5); // km

  const handleGardenClick = (garden: typeof gardens[0]) => {
    setSelectedGarden(garden);
  };

  const handleMapGardenClick = (garden: any) => {
    // Find the full garden object from our data
    const fullGarden = gardens.find(g => g.id === garden.id);
    if (fullGarden) {
      setSelectedGarden(fullGarden);
    }
  };

  const handleBackClick = () => {
    setSelectedGarden(null);
  };

  const handleFilterChange = (filter: "all" | "VG" | "BS") => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Function to get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        console.log('User location:', latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your browser permissions.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Filter gardens based on active filter, search query, and nearby location
  const filteredGardens = gardens.filter(garden => {
    // Filter by type
    const typeMatch = activeFilter === "all" || garden.type === activeFilter;
    
    // Enhanced search - includes name, location, and type
    const searchMatch = !searchQuery || (() => {
      const query = searchQuery.toLowerCase();
      return (
        garden.name.toLowerCase().includes(query) ||
        garden.location.toLowerCase().includes(query) ||
        (garden.type === "VG" && (query.includes("verge") || query.includes("garden"))) ||
        (garden.type === "BS" && (query.includes("bioswale") || query.includes("swale"))) ||
        query.includes(garden.type.toLowerCase())
      );
    })();
    
    // Filter by nearby location if user location is available
    const nearbyMatch = !userLocation || (() => {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        garden.lat, 
        garden.lng
      );
      return distance <= nearbyRadius;
    })();
    
    return typeMatch && searchMatch && nearbyMatch;
  });

  if (selectedGarden) {
    return (
      <GardenDetailView
        garden={selectedGarden}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${hero})` }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <img className="w-[120px]" src={logo} alt="Logo" />
            </div>
          </div>

          {/* Search Bar */}
          <LocationSearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onGetLocation={getUserLocation}
            userLocation={userLocation}
            nearbyRadius={nearbyRadius}
            onRadiusChange={setNearbyRadius}
          />
        </div>

        {/* Filter Bar */}
        <GardenFilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </header>

      {/* Main Content */}
      <main className="px-6 py-3">
        {/* Search Results and View Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-full text-sm transition-colors ${viewMode === "list"
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-2 rounded-full text-sm transition-colors ${viewMode === "map"
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              Map
            </button>
          </div>

          {/* Search Results Counter */}
          {(searchQuery || userLocation) && (
            <div className="text-sm text-gray-600">
              {filteredGardens.length} garden{filteredGardens.length !== 1 ? 's' : ''} found
              {userLocation && ` within ${nearbyRadius}km`}
            </div>
          )}
        </div>
        <div className="max-w-7xl mx-auto">
          {viewMode === "map" ? (
            <MapView gardens={filteredGardens} onGardenClick={handleMapGardenClick} />
          ) : (
            <>
              {/* Gardens Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGardens.map((garden) => (
                  <GardenCard
                    key={garden.id}
                    id={garden.id}
                    name={garden.name}
                    location={garden.location}
                    type={garden.type}
                    imageUrl={garden.imageUrl}
                    health={garden.health}
                    soilMoisture={garden.soilMoisture}
                    pH={garden.pH}
                    waterDepth={garden.waterDepth}
                    floodRisk={garden.floodRisk}
                    onClick={() => handleGardenClick(garden)}
                  />
                ))}
              </div>

            </>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-black text-lg pb-3 font-semibold mb-3 border-b border-gray-300">Our Verge</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="pb-3">
            <h3 className="text-black text-lg pb-3 font-semibold mb-3 border-b border-gray-300">Resources</h3>
            <ul className="space-y-2 ">
              <li><a href="#" className="hover:text-white">Acknowledgment of Country</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Use</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Example Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
}