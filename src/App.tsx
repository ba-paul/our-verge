import { useState } from "react";
import { LocationSearchBar } from "./components/LocationSearchBar";
import { GardenFilterBar } from "./components/GardenFilterBar";
import { MapView } from "./components/MapView";
import { GardenCard } from "./components/GardenCard";
import { GardenDetailView } from "./components/GardenDetailView";
import logo from '../images/the-verge-logo-2.png'; 
import hero from '../images/verge-hero-photo.jpg'; 


// Mock data for gardens
const gardens = [
  {
    id: "1",
    name: "Riverside Verge Garden",
    location: "Main St & River Ave, Portland",
    type: "VG" as const,
    imageUrl: "https://images.unsplash.com/photo-1699616784901-836039b5cead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGdhcmRlbiUyMHBhcmt8ZW58MXx8fHwxNzU3NjQxMzUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    health: "good" as const,
    soilMoisture: 75,
    pH: 6.8,
    waterDepth: 12,
    floodRisk: "low" as const,
    lat: -26.8241352382323,
    lng: 153.0549933062039,
    plants: [
      { name: "Pacific Ninebark", scientificName: "Physocarpus capitatus", status: "healthy" as const },
      { name: "Oregon Grape", scientificName: "Mahonia aquifolium", status: "healthy" as const },
      { name: "Red Flowering Currant", scientificName: "Ribes sanguineum", status: "needs-attention" as const },
    ],
    comments: [
      {
        id: "1",
        author: "Sarah M.",
        date: "2 days ago",
        content: "Completed weekly weeding and noticed new growth on the ninebark shrubs.",
        type: "maintenance" as const,
      },
      {
        id: "2",
        author: "Mike T.",
        date: "1 week ago",
        content: "Some of the currant plants look like they need pruning.",
        type: "observation" as const,
      },
    ],
  },
  {
    id: "2",
    name: "Downtown Bioswale",
    location: "5th Ave & Pine St, Seattle",
    type: "BS" as const,
    imageUrl: "https://images.unsplash.com/photo-1666228459069-d308cbea796b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9zd2FsZSUyMHJhaW4lMjBnYXJkZW58ZW58MXx8fHwxNzU3NjQxMzU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    health: "fair" as const,
    soilMoisture: 85,
    pH: 7.2,
    waterDepth: 18,
    floodRisk: "medium" as const,
    lat: 45,
    lng: 60,
    plants: [
      { name: "Sedge", scientificName: "Carex obnupta", status: "healthy" as const },
      { name: "Douglas Iris", scientificName: "Iris douglasiana", status: "healthy" as const },
      { name: "Rushes", scientificName: "Juncus patens", status: "poor" as const },
    ],
    comments: [
      {
        id: "3",
        author: "City Maintenance",
        date: "3 days ago",
        content: "Drainage inspection completed. Water flow is adequate but monitoring needed.",
        type: "maintenance" as const,
      },
    ],
  },
  {
    id: "3",
    name: "Hillside Native Garden",
    location: "Oak St Slope, San Francisco",
    type: "VG" as const,
    imageUrl: "https://images.unsplash.com/photo-1706644533651-0b8cf3909f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJnZSUyMGdhcmRlbiUyMHBsYW50c3xlbnwxfHx8fDE3NTc2NDEzNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    health: "good" as const,
    soilMoisture: 65,
    pH: 6.5,
    waterDepth: 8,
    floodRisk: "low" as const,
    lat: 70,
    lng: 25,
    plants: [
      { name: "California Poppies", scientificName: "Eschscholzia californica", status: "healthy" as const },
      { name: "Lavender", scientificName: "Lavandula stoechas", status: "healthy" as const },
      { name: "Sage", scientificName: "Salvia leucantha", status: "healthy" as const },
    ],
    comments: [
      {
        id: "4",
        author: "Garden Volunteer",
        date: "5 days ago",
        content: "Added mulch around the poppy beds and removed invasive weeds.",
        type: "maintenance" as const,
      },
    ],
  },
  {
    id: "4",
    name: "Community Wildflower Strip",
    location: "Elm Ave Median, Denver",
    type: "VG" as const,
    imageUrl: "https://images.unsplash.com/photo-1754373647291-2206bdafbd5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXRpdmUlMjBwbGFudHMlMjB3aWxkZmxvd2Vyc3xlbnwxfHx8fDE3NTc2NDEzNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    health: "good" as const,
    soilMoisture: 70,
    pH: 7.0,
    waterDepth: 5,
    floodRisk: "low" as const,
    lat: 35,
    lng: 80,
    plants: [
      { name: "Black-eyed Susan", scientificName: "Rudbeckia hirta", status: "healthy" as const },
      { name: "Purple Coneflower", scientificName: "Echinacea purpurea", status: "healthy" as const },
      { name: "Native Grasses", scientificName: "Bouteloua gracilis", status: "needs-attention" as const },
    ],
    comments: [
      {
        id: "5",
        author: "Lisa K.",
        date: "1 day ago",
        content: "Beautiful bloom season! The coneflowers are attracting lots of bees.",
        type: "observation" as const,
      },
    ],
  },
  {
    id: "5",
    name: "Flood Management Bioswale",
    location: "Industrial Way, Portland",
    type: "BS" as const,
    imageUrl: "https://images.unsplash.com/photo-1695462131713-7bbfb8317ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXJkZW4lMjBtYWludGVuYW5jZXxlbnwxfHx8fDE3NTc2NDEzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    health: "poor" as const,
    soilMoisture: 95,
    pH: 7.8,
    waterDepth: 22,
    floodRisk: "high" as const,
    lat: 55,
    lng: 15,
    plants: [
      { name: "Cattails", scientificName: "Typha latifolia", status: "healthy" as const },
      { name: "Water Iris", scientificName: "Iris pseudacorus", status: "needs-attention" as const },
      { name: "Willow Shrubs", scientificName: "Salix lucida", status: "poor" as const },
    ],
    comments: [
      {
        id: "6",
        author: "Emergency Services",
        date: "Today",
        content: "High water alert - monitoring for potential overflow. Drainage maintenance scheduled.",
        type: "concern" as const,
      },
    ],
  },
];

export default function App() {
  const [selectedGarden, setSelectedGarden] = useState<typeof gardens[0] | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const handleGardenClick = (garden: typeof gardens[0]) => {
    setSelectedGarden(garden);
  };

  const handleBackClick = () => {
    setSelectedGarden(null);
  };

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
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="px-6 py-4">
          {/* <div className="flex items-center">
            <img
              src={hero}
              alt="Logo"
              className="max-h-[200px] w-auto h-auto object-contain mx-auto"
            />
          </div> */}
          <div className="flex items-center justify-center mb-4">
            { }
            <div className="flex items-center">
              <img className="w-[100px]" src={logo} alt="Logo" />
            </div>
          </div>

          {/* Search Bar */}
          <LocationSearchBar />
        </div>

        {/* Filter Bar */}
        <GardenFilterBar />
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* View Toggle */}
        <div className="flex items-center gap-2 px-3 rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
          >
            Map
          </button>
        </div>
        <div className="max-w-7xl mx-auto">
          {viewMode === "map" ? (
            <MapView gardens={gardens} onGardenClick={handleGardenClick} />
          ) : (
            <>
              {/* Gardens Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gardens.map((garden) => (
                  <GardenCard
                    key={garden.id}
                    {...garden}
                    onClick={() => handleGardenClick(garden)}
                  />
                ))}
              </div>

              {/* Load more gardens placeholder */}
              <div className="flex justify-center mt-12">
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Show more gardens
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}