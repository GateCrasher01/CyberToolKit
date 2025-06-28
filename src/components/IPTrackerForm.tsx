
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { fetchCurrentIP } from "@/utils/ipTrackingUtils";

interface IPTrackerFormProps {
  ip: string;
  setIp: (ip: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const IPTrackerForm = ({ ip, setIp, isLoading, onSubmit }: IPTrackerFormProps) => {
  const handleCurrentIpFetch = async () => {
    toast.loading("Fetching your IP address...");
    const { ip: currentIp, error } = await fetchCurrentIP();
    toast.dismiss();
    
    if (error) {
      toast.error(error);
    } else if (currentIp) {
      setIp(currentIp);
      toast.success("Your IP address retrieved");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Enter IP Address</CardTitle>
        </div>
        <CardDescription>
          Enter an IP address to track its location and gather detailed network information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCurrentIpFetch}
              disabled={isLoading}
            >
              Get My IP
            </Button>
            <Button type="submit" disabled={!ip || isLoading}>
              {isLoading ? "Tracing..." : "Track"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
