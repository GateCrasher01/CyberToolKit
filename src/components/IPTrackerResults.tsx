
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ResultCard } from "@/components/ResultCard";
import { Map } from "lucide-react";
import { MapView } from "@/components/MapView";
import { ThreatIntelligence } from "@/components/ThreatIntelligence";

interface IPTrackerResultsProps {
  results: Record<string, any> | null;
  coordinates: { lat: number; lng: number } | null;
  threatData: any;
}

export const IPTrackerResults = ({ results, coordinates, threatData }: IPTrackerResultsProps) => {
  if (!results) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <ResultCard title="IP Tracking Results" data={results} />
        </div>
        
        {coordinates && (
          <div className="flex-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Geolocation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm mb-2">
                  <div><span className="font-semibold">Latitude:</span> {coordinates.lat}</div>
                  <div><span className="font-semibold">Longitude:</span> {coordinates.lng}</div>
                </div>
                
                <div className="h-[300px] mt-4 overflow-hidden rounded-md border">
                  <MapView 
                    latitude={coordinates.lat} 
                    longitude={coordinates.lng} 
                    ipAddress={results["IP Address"]}
                    country={results["Country"]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {threatData && (
        <ThreatIntelligence threatData={threatData} />
      )}
    </div>
  );
};
