import { useState } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle, FileText, MessageSquare, Leaf, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Plant {
  name: string;
  scientificName: string;
  status: "healthy" | "needs-attention" | "poor";
}

interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
  type: "maintenance" | "observation" | "concern";
}

interface GardenDetailViewProps {
  garden: {
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
    plants: Plant[];
    comments: Comment[];
  };
  onBack: () => void;
}

export function GardenDetailView({ garden, onBack }: GardenDetailViewProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(garden.comments || []);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const randomNames = [
    "Sarah M.", "Mike T.", "Emily R.", "Tom B.", 
    "Jasmine K.", "Liam P.", "Olivia W.", "Noah C.", 
    "Grace L.", "Ethan J."
  ];

  function getRandomName() {
    return randomNames[Math.floor(Math.random() * randomNames.length)];
  }
  

  const getHealthScore = () => {
    switch (garden.health) {
      case "good": return 85;
      case "fair": return 65;
      case "poor": return 35;
      default: return 0;
    }
  };

  const getFloodRiskColor = () => {
    switch (garden.floodRisk) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getFloodRiskIcon = () => {
    switch (garden.floodRisk) {
      case "low": return <CheckCircle className="h-4 w-4" />;
      case "medium": 
      case "high": return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getWaterCapacity = () => {
    // Mock calculation based on water depth
    return Math.min((garden.waterDepth / 20) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-medium">{garden.name}</h1>
              <p className="text-gray-600">{garden.location}</p>
            </div>
            <Badge className={garden.type === "VG" ? "bg-green-500" : "bg-blue-500"}>
              {garden.type === "VG" ? "Verge Garden" : "Bioswale"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Garden Image */}
        <div className="aspect-video rounded-lg overflow-hidden">
          <ImageWithFallback
            src={garden.imageUrl}
            alt={garden.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Health Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span>Overall Health</span>
                <span className="font-medium">{getHealthScore()}%</span>
              </div>
              <Progress value={getHealthScore()} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Soil Moisture</div>
                <div className="text-lg font-medium">{garden.soilMoisture}%</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">pH Level</div>
                <div className="text-lg font-medium">{garden.pH}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600">Water Depth</div>
                <div className="text-lg font-medium">{garden.waterDepth}cm</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flood Risk Warning */}
        <Card className={getFloodRiskColor()}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {getFloodRiskIcon()}
              <div className="flex-1">
                <div className="font-medium">
                  {garden.floodRisk === "high" ? "High Flood Risk" : 
                   garden.floodRisk === "medium" ? "Caution: Moderate Water Level" : 
                   "Safe Water Level"}
                </div>
                <div className="text-sm opacity-90">
                  Water level at {getWaterCapacity().toFixed(0)}% capacity
                  {garden.floodRisk === "high" && " - Consider drainage maintenance"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
          >
            <FileText className="h-4 w-4" />
            Lodge Maintenance Report
          </Button>
        </div>

        {showMaintenanceForm && (
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!reportSubmitted ? (
                <>
                  <Textarea
                    placeholder="Describe the maintenance issue or work completed..."
                    className="min-h-24"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => setReportSubmitted(true)}>
                      Submit Report
                    </Button>
                    <Button variant="outline" onClick={() => setShowMaintenanceForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-green-600 font-medium">
                    Maintenance report successfully lodged!
                  </p>
                  <Button onClick={() => { setReportSubmitted(false); setShowMaintenanceForm(false); }}>
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Native Plants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Native Plants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {garden.plants.map((plant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{plant.name}</div>
                    <div className="text-sm text-gray-600 italic">{plant.scientificName}</div>
                  </div>
                  <Badge
                    variant={plant.status === "healthy" ? "default" :
                      plant.status === "needs-attention" ? "secondary" : "destructive"}
                  >
                    {plant.status.replace("-", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notes & Comments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a note about planting, weeding, or observations..."
                className="min-h-20"
              />
              <Button
                onClick={() => {
                  if (!newComment.trim()) return;
                  const newEntry = {
                    id: Date.now().toString(),
                    author: getRandomName(),
                    date: new Date().toLocaleDateString(),
                    content: newComment.trim(),
                    type: "observation",
                  };
                  setComments([newEntry, ...comments]); // prepend new comment
                  setNewComment("");
                }}
              >
                Add Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{comment.author}</div>
                    <div className="text-sm text-gray-500">{comment.date}</div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <Badge variant="outline" className="mt-2">
                    {comment.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}