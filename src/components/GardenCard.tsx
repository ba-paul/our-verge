import { MapPin, Droplets, Activity, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";

interface GardenCardProps {
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
  onClick: () => void;
}

export function GardenCard({
  name,
  location,
  type,
  imageUrl,
  health,
  soilMoisture,
  pH,
  waterDepth,
  floodRisk,
  onClick,
}: GardenCardProps) {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "good": return "bg-green-100 text-green-800";
      case "fair": return "bg-yellow-100 text-yellow-800";
      case "poor": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFloodRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "VG" ? "bg-green-500" : "bg-blue-500";
  };

  return (
    <div 
      className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <Badge className={`${getTypeColor(type)} text-white`}>
            {type === "VG" ? "Verge Garden" : "Bioswale"}
          </Badge>
          <Badge className={getHealthColor(health)}>
            {health}
          </Badge>
        </div>
        {floodRisk === "high" && (
          <div className="absolute top-2 right-2">
            <AlertTriangle className={`h-5 w-5 ${getFloodRiskColor(floodRisk)}`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Name and Location */}
        <div>
          <h3 className="text-lg font-medium truncate">{name}</h3>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="text-sm truncate">{location}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded">
            <Droplets className="h-3 w-3 mx-auto mb-1 text-blue-500" />
            <div>Moisture</div>
            <div className="font-medium">{soilMoisture}%</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <Activity className="h-3 w-3 mx-auto mb-1 text-green-500" />
            <div>pH</div>
            <div className="font-medium">{pH}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="w-3 h-3 mx-auto mb-1 bg-blue-400 rounded-full"></div>
            <div>Water</div>
            <div className="font-medium">{waterDepth}mm</div>
          </div>
        </div>
      </div>
    </div>
  );
}