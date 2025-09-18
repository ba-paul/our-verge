import React, { useMemo, useEffect, useState } from "react";
import { MapPin, ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import palmTreeIcon from "../../images/tree-palm-regular-full.svg";

interface Garden {
  id: string;
  name: string;
  location: string;
  type: "VG" | "BS";
  lat: number;
  lng: number;
  health: "good" | "fair" | "poor";
  floodRisk: "low" | "medium" | "high";
  soilMoisture: number;
  pH: number;
  waterDepth: number;
}

interface MapViewProps {
  gardens: Garden[];
  onGardenClick: (garden: Garden) => void;
}

// Create custom palm tree icons
const createPalmTreeIcon = (type: "VG" | "BS", health: "good" | "fair" | "poor", floodRisk: "low" | "medium" | "high") => {
  const color = type === "VG" ? "#22c55e" : "#3b82f6";
  const healthColor = health === "good" ? "#4ade80" : health === "fair" ? "#facc15" : "#ef4444";
  
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 24px;
          height: 24px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,.25);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <svg width="16" height="16" viewBox="0 0 640 640">
            <path fill="white" d="M135 155.4L165.3 205.9C161.3 209.4 157.3 213.1 153.3 217.1C82.3 288.1 93.1 368.1 120.6 408.4C125.6 415.7 135.8 415.7 142 409.4L268.1 283.3C270.4 292.6 272.4 303.6 273.7 316.2C278.6 362.8 274.2 431.3 247.3 524.5C240 549.8 258.6 576 285.8 576L369.9 576C389.9 576 407.5 561 409.5 540.3C418.7 444.8 403.6 338.3 375.2 256L478.7 256C481.5 256 484.1 254.5 485.6 252.1L505.2 219.4C508.3 214.2 515.8 214.2 518.9 219.4L538.5 252.1C539.9 254.5 542.6 256 545.4 256L592.1 256C601 256 608.2 248.8 606.6 240.1C597.5 192.2 548.5 128 448.2 128C404.5 128 370.6 140.2 345.4 157.8C328.7 113.4 280.2 64 192.2 64C91.8 64 42.8 128.2 33.7 176.1C32.1 184.8 39.3 192 48.2 192L94.9 192C97.7 192 100.3 190.5 101.8 188.1L121.3 155.4C124.4 150.2 131.9 150.2 135 155.4zM324.2 256C352.8 330.1 370.2 433.9 362.5 528L296.3 528C322.1 435.1 327 363.5 321.5 311.2C319.3 289.7 315.3 271.3 310.1 256L324.2 256z"/>
          </svg>
        </div>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function FitBounds({ gardens }: { gardens: Garden[] }) {
  const map = useMap();
  useEffect(() => {
    if (!gardens?.length) return;
    
    // Small delay to ensure map is fully loaded
    const timer = setTimeout(() => {
      const bounds = L.latLngBounds(gardens.map((g) => [g.lat, g.lng] as [number, number]));
      map.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 15 // Prevent zooming in too much for single points
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [gardens, map]);
  return null;
}

function MapControls({
  onRecenter,
}: {
  onRecenter: () => void;
}) {
  const map = useMap();
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 p-0 bg-white hover:bg-gray-50"
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 p-0 bg-white hover:bg-gray-50"
        onClick={() => map.setZoom(map.getZoom() - 1)}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 p-0 bg-white hover:bg-gray-50"
        onClick={() => onRecenter()}
      >
        <Navigation className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function MapView({ gardens, onGardenClick }: MapViewProps) {
  const [selectedGarden, setSelectedGarden] = useState<Garden | null>(null);
  const center: [number, number] = [-27.4698, 153.0251];
  const zoom = 12;

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border">
      {/* REAL Queensland map */}
      <MapContainer
        // Rough geographic center of Queensland
        center={[-20.5, 146.5]}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Auto-fit bounds to show all gardens */}
        <FitBounds gardens={gardens} />

        {/* Markers for your gardens */}
        {gardens.map((g) => (
          <Marker
            key={g.id}
            position={[g.lat, g.lng]}
            icon={createPalmTreeIcon(g.type, g.health, g.floodRisk)}
            eventHandlers={{ click: () => setSelectedGarden(g) }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{g.name}</div>
                <div className="text-gray-600">{g.location}</div>
                <div className="mt-1">
                  Health:{" "}
                  <b
                    className={
                      g.health === "good"
                        ? "text-green-600"
                        : g.health === "fair"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }
                  >
                    {g.health}
                  </b>{" "}
                  • pH {g.pH} • Moisture {g.soilMoisture}%
                </div>
                {g.floodRisk === "high" && (
                  <div className="mt-1 text-red-700">
                    ⚠ High flood risk — level{" "}
                    {Math.min((g.waterDepth / 20) * 100, 100).toFixed(0)}%
                  </div>
                )}
                <Button
                  size="sm"
                  className="mt-2 bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
                  onClick={() => onGardenClick(g)}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Selected Garden Popup (card overlay) */}
      {selectedGarden && (
        <div className="absolute bottom-4 left-4 right-4 z-[1001]">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{selectedGarden.name}</h3>
                  <p className="text-xs text-gray-600">{selectedGarden.location}</p>
                </div>
                <div className="flex gap-1">
                  <Badge
                    className={
                      selectedGarden.type === "VG" ? "bg-green-500" : "bg-blue-500"
                    }
                  >
                    {selectedGarden.type === "VG" ? "Verge Garden" : "Bioswale"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                <div>
                  <span className="text-gray-500">Health:</span>
                  <span
                    className={`ml-1 capitalize ${selectedGarden.health === "good"
                        ? "text-green-600"
                        : selectedGarden.health === "fair"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                  >
                    {selectedGarden.health}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Moisture:</span>{" "}
                  {selectedGarden.soilMoisture}%
                </div>
                <div>
                  <span className="text-gray-500">pH:</span> {selectedGarden.pH}
                </div>
              </div>

              {selectedGarden.floodRisk === "high" && (
                <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  ⚠️ High flood risk - Water level at{" "}
                  {Math.min((selectedGarden.waterDepth / 20) * 100, 100).toFixed(0)}%
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onGardenClick(selectedGarden)}
                  className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedGarden(null)}
                  className="text-xs px-3 py-1"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg z-9999 border max-w-xs">
        <h4 className="text-sm font-medium mb-2 text-gray-800">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 640 640">
                <path fill="white" d="M135 155.4L165.3 205.9C161.3 209.4 157.3 213.1 153.3 217.1C82.3 288.1 93.1 368.1 120.6 408.4C125.6 415.7 135.8 415.7 142 409.4L268.1 283.3C270.4 292.6 272.4 303.6 273.7 316.2C278.6 362.8 274.2 431.3 247.3 524.5C240 549.8 258.6 576 285.8 576L369.9 576C389.9 576 407.5 561 409.5 540.3C418.7 444.8 403.6 338.3 375.2 256L478.7 256C481.5 256 484.1 254.5 485.6 252.1L505.2 219.4C508.3 214.2 515.8 214.2 518.9 219.4L538.5 252.1C539.9 254.5 542.6 256 545.4 256L592.1 256C601 256 608.2 248.8 606.6 240.1C597.5 192.2 548.5 128 448.2 128C404.5 128 370.6 140.2 345.4 157.8C328.7 113.4 280.2 64 192.2 64C91.8 64 42.8 128.2 33.7 176.1C32.1 184.8 39.3 192 48.2 192L94.9 192C97.7 192 100.3 190.5 101.8 188.1L121.3 155.4C124.4 150.2 131.9 150.2 135 155.4zM324.2 256C352.8 330.1 370.2 433.9 362.5 528L296.3 528C322.1 435.1 327 363.5 321.5 311.2C319.3 289.7 315.3 271.3 310.1 256L324.2 256z"/>
              </svg>
            </div>
            <span>VG - Verge Garden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 640 640">
                <path fill="white" d="M135 155.4L165.3 205.9C161.3 209.4 157.3 213.1 153.3 217.1C82.3 288.1 93.1 368.1 120.6 408.4C125.6 415.7 135.8 415.7 142 409.4L268.1 283.3C270.4 292.6 272.4 303.6 273.7 316.2C278.6 362.8 274.2 431.3 247.3 524.5C240 549.8 258.6 576 285.8 576L369.9 576C389.9 576 407.5 561 409.5 540.3C418.7 444.8 403.6 338.3 375.2 256L478.7 256C481.5 256 484.1 254.5 485.6 252.1L505.2 219.4C508.3 214.2 515.8 214.2 518.9 219.4L538.5 252.1C539.9 254.5 542.6 256 545.4 256L592.1 256C601 256 608.2 248.8 606.6 240.1C597.5 192.2 548.5 128 448.2 128C404.5 128 370.6 140.2 345.4 157.8C328.7 113.4 280.2 64 192.2 64C91.8 64 42.8 128.2 33.7 176.1C32.1 184.8 39.3 192 48.2 192L94.9 192C97.7 192 100.3 190.5 101.8 188.1L121.3 155.4C124.4 150.2 131.9 150.2 135 155.4zM324.2 256C352.8 330.1 370.2 433.9 362.5 528L296.3 528C322.1 435.1 327 363.5 321.5 311.2C319.3 289.7 315.3 271.3 310.1 256L324.2 256z"/>
              </svg>
            </div>
            <span>BS - Bioswale</span>
          </div>
        </div>
      </div>
    </div>
  );


}
