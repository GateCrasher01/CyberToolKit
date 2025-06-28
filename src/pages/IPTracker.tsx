
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { IPTrackerForm } from "@/components/IPTrackerForm";
import { IPTrackerResults } from "@/components/IPTrackerResults";
import { PrivacyInfo } from "@/components/PrivacyInfo";
import { fetchIPData } from "@/utils/ipTrackingUtils";
import { fetchThreatIntelligence } from "@/utils/threatIntelligenceUtils";

const IPTracker = () => {
  const [ip, setIp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [threatData, setThreatData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip) return;

    setIsLoading(true);
    setError(null);
    setResults(null);
    setThreatData(null);
    setCoordinates(null);
    toast.loading("Tracing IP address...");
    
    try {
      // Fetch IP data
      const { formattedData, coordinates: coords, error: ipError } = await fetchIPData(ip);
      
      if (ipError) {
        throw new Error(ipError);
      }
      
      setResults(formattedData);
      
      if (coords) {
        setCoordinates(coords);
      }
      
      // Fetch threat intelligence
      const { threatData: threat } = await fetchThreatIntelligence(ip);
      setThreatData(threat);
      
      toast.dismiss();
      toast.success("IP trace completed");
    } catch (err) {
      console.error("IP tracking error:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to IP tracking service");
      toast.dismiss();
      toast.error("IP trace failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">IP Tracker</h1>
        <p className="text-muted-foreground">
          Track and analyze real IP addresses to gather location and network information.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <IPTrackerForm 
        ip={ip}
        setIp={setIp}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      {results && (
        <IPTrackerResults 
          results={results}
          coordinates={coordinates}
          threatData={threatData}
        />
      )}

      <PrivacyInfo />
    </div>
  );
};

export default IPTracker;
