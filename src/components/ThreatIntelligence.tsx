
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, AlertCircle, CheckCircle2, Search, Skull } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ThreatIntelligenceProps {
  threatData: {
    abuseConfidenceScore: number;
    totalReports: number;
    lastReportedAt: string;
    isWhitelisted: boolean;
    darkWebMentions: number;
    usageType: string;
    recentAttackTypes: string[];
    lastDarkWebMention: string | null;
  };
}

export const ThreatIntelligence = ({ threatData }: ThreatIntelligenceProps) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Determine threat level color
  const getThreatLevelColor = (score: number) => {
    if (score < 25) return "bg-green-500";
    if (score < 50) return "bg-yellow-500";
    if (score < 75) return "bg-orange-500";
    return "bg-red-500";
  };
  
  // Determine threat level text
  const getThreatLevelText = (score: number) => {
    if (score < 10) return "Clean";
    if (score < 25) return "Low Risk";
    if (score < 50) return "Medium Risk";
    if (score < 75) return "High Risk";
    return "Critical Risk";
  };
  
  // Get appropriate icon based on threat level
  const getThreatIcon = (score: number) => {
    if (score < 25) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (score < 50) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    if (score < 75) return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    return <Skull className="h-5 w-5 text-red-500" />;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Threat Intelligence</CardTitle>
          </div>
          <CardDescription>
            Security analysis and threat assessment for this IP address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Threat Score */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Threat Assessment</h3>
                  <Badge 
                    className={`${
                      threatData.abuseConfidenceScore < 25 ? "bg-green-500" : 
                      threatData.abuseConfidenceScore < 50 ? "bg-yellow-500" : 
                      threatData.abuseConfidenceScore < 75 ? "bg-orange-500" : 
                      "bg-red-500"
                    } text-white hover:opacity-90`}
                  >
                    {getThreatLevelText(threatData.abuseConfidenceScore)}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <Progress 
                    value={threatData.abuseConfidenceScore} 
                    max={100}
                    className={cn("h-2 w-full bg-slate-200", getThreatLevelColor(threatData.abuseConfidenceScore))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Confidence Score: {threatData.abuseConfidenceScore}/100
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm mt-2">
                  <div className="flex items-center gap-1.5">
                    {getThreatIcon(threatData.abuseConfidenceScore)}
                    <span>
                      {threatData.isWhitelisted 
                        ? "Whitelisted IP" 
                        : `${threatData.totalReports} reports`}
                    </span>
                  </div>
                  {!threatData.isWhitelisted && (
                    <span className="text-xs text-muted-foreground">
                      Last reported: {formatDate(threatData.lastReportedAt)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Usage Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Network Classification</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-sm">Usage Type:</span>
                    <span className="text-sm font-medium">{threatData.usageType}</span>
                  </div>
                  
                  {threatData.recentAttackTypes.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm">Recent Attack Types:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {threatData.recentAttackTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Dark Web Mentions */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium">Dark Web Intelligence</h3>
              </div>
              
              <div className="bg-muted/50 rounded-md p-3">
                {threatData.darkWebMentions > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1.5">
                        <AlertCircle className={`h-4 w-4 ${threatData.darkWebMentions > 5 ? "text-red-500" : "text-yellow-500"}`} />
                        <span>{threatData.darkWebMentions} mentions found on dark web forums</span>
                      </span>
                      {threatData.lastDarkWebMention && (
                        <span className="text-xs text-muted-foreground">
                          Last mention: {formatDate(threatData.lastDarkWebMention)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This IP address has been mentioned in dark web forums and marketplaces, 
                      potentially indicating involvement in malicious activities.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No mentions found on dark web forums</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-xs text-muted-foreground text-center">
        <p>
          Note: Threat intelligence data is provided by AbuseIPDB. Dark web data is simulated for demonstration purposes.
        </p>
      </div>
    </div>
  );
};
