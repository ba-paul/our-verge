import React, { useMemo, useEffect, useState } from "react";
import { MapPin, ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function useColoredDivIcon(g: Garden) {
  return useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
          <div style="
            position:relative;
            width:22px;height:22px;border-radius:9999px;
            border:2px solid #fff;
            box-shadow:0 2px 6px rgba(0,0,0,.25);
            background:${g.type === "VG" ? "#22c55e" : "#3b82f6"}">
            <div style="
              position:absolute;left:-4px;top:-4px;width:8px;height:8px;border:1px solid #fff;border-radius:9999px;
              background:${g.health === "good" ? "#4ade80" : g.health === "fair" ? "#facc15" : "#ef4444"}">
            </div>
            ${g.floodRisk === "high"
              ? `<div style="position:absolute;right:-3px;top:-3px;width:6px;height:6px;border-radius:9999px;background:#ef4444"></div>`
              : ""}
          </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    [g]
  );
}

function FitBounds({ gardens }: { gardens: Garden[] }) {
  const map = useMap();
  useEffect(() => {
    if (!gardens?.length) return;
    const b = L.latLngBounds(gardens.map((g) => [g.lat, g.lng] as [number, number]));
    map.fitBounds(b, { padding: [40, 40] });
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

        {/* Markers for your gardens */}
        {gardens.map((g) => (
          <Marker
            key={g.id}
            position={[g.lat, g.lng]}
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

      {/* Legend (kept from your UI) */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg z-[1000]">
        <h4 className="text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>VG - Verge Garden</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>BS - Bioswale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            </div>
            <span>Health Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Flood Alert</span>
          </div>
        </div>
      </div>
    </div>
  );


}
