
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const PrivacyInfo = () => {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Privacy Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The IP tracking tool uses public data sources including ipwho.is and ipapi.co to provide 
          real information about IP addresses. The data includes geolocation, network, and security details.
          We do not store any IP addresses or tracking results on our servers.
        </p>
      </CardContent>
    </Card>
  );
};
