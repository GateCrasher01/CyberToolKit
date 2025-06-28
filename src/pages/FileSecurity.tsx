
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import FileSecurityForm from "@/components/file-sharing/FileSecurityForm";
import { useMockFileOperations } from "@/hooks/useMockFileOperations";

const FileSecurity = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    checkFileSecurityAsync, 
    isSecurityCheckLoading,
    securityResult,
    fileHash
  } = useMockFileOperations();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">File Security Scanner</h1>
        <p className="text-muted-foreground">
          Check file integrity and scan for malware using advanced analysis techniques.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">File Integrity Checker</CardTitle>
          </div>
          <CardDescription>
            Check file integrity and scan for potential security threats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileSecurityForm
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isSecurityCheckLoading={isSecurityCheckLoading}
            securityResult={securityResult}
            fileHash={fileHash}
            checkFileSecurityAsync={checkFileSecurityAsync}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FileSecurity;
