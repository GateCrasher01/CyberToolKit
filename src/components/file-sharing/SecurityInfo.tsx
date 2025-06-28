
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SecurityInfo = () => {
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Security Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Files are encrypted with AES-256 encryption before transmission.
          Your password is used as a key to encrypt and decrypt the files.
          For maximum security, share the password through a secure channel
          and use a strong, unique password for each file transfer.
        </p>
      </CardContent>
    </Card>
  );
};

export default SecurityInfo;
