
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, Info, ExternalLink, FileText } from "lucide-react";
import FileSecurityIndicator from "@/components/FileSecurityIndicator";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ResultCard } from "@/components/ResultCard";

interface FileSecurityFormProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isSecurityCheckLoading: boolean;
  securityResult: {
    rating: "safe" | "suspicious" | "malicious";
    color: string;
    message: string;
    detectionDetails?: {
      vendorName: string;
      detection: string;
    }[];
    stats?: {
      totalVendors: number;
      detections: number;
    };
  } | null;
  fileHash: string | null;
  checkFileSecurityAsync: (file: File) => Promise<void>;
}

const FileSecurityForm = ({
  selectedFile,
  setSelectedFile,
  isSecurityCheckLoading,
  securityResult,
  fileHash,
  checkFileSecurityAsync,
}: FileSecurityFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleCheckFileSecurity = async () => {
    if (!selectedFile) return;
    
    setErrorMessage(null);
    try {
      await checkFileSecurityAsync(selectedFile);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(errorMsg);
      console.error("File security check error:", errorMsg);
    }
  };

  const extractHashFromError = (error: string): string | null => {
    const match = error.match(/https:\/\/www\.virustotal\.com\/gui\/file\/([a-f0-9]{64})\/detection/);
    return match ? match[1] : null;
  };

  const errorHash = errorMessage ? extractHashFromError(errorMessage) : null;

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} bytes`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    if (sizeInBytes < 1024 * 1024 * 1024) return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getLastAnalysisTime = (): string => {
    return "just now (client-side analysis)";
  };

  const getFileDetails = (): Record<string, any> | null => {
    if (!selectedFile) return null;
    
    return {
      "Filename": selectedFile.name,
      "Size": formatFileSize(selectedFile.size),
      "Type": selectedFile.type || "Unknown",
      "Last Analysis": getLastAnalysisTime(),
      "SHA-256": fileHash || "Calculating...",
    };
  };

  const getSecurityDetails = (): Record<string, any> | null => {
    if (!securityResult) return null;
    
    const details: Record<string, any> = {
      "Security Rating": securityResult.rating.charAt(0).toUpperCase() + securityResult.rating.slice(1),
      "Detection Ratio": securityResult.stats ? `${securityResult.stats.detections}/${securityResult.stats.totalVendors}` : "0/0",
    };
    
    if (fileHash) {
      details["VirusTotal Link"] = `https://www.virustotal.com/gui/file/${fileHash}`;
    }
    
    return details;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="security-file">Select File to Analyze</Label>
        <Input
          id="security-file"
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      {selectedFile && (
        <div className="text-sm bg-muted rounded-md p-3 mt-2">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="font-medium">{selectedFile.name}</p>
          </div>
          <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
          <p><span className="font-medium">Type:</span> {selectedFile.type || "Unknown"}</p>
        </div>
      )}

      <Button
        type="button"
        className="w-full"
        onClick={handleCheckFileSecurity}
        disabled={!selectedFile || isSecurityCheckLoading}
      >
        {isSecurityCheckLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Analyzing...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-1" /> Check File Security
          </>
        )}
      </Button>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <div className="ml-2">
            <AlertTitle>Security Check Error</AlertTitle>
            <AlertDescription className="mt-1">
              {errorMessage}
              
              {errorHash && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 bg-destructive/10"
                    onClick={() => window.open(`https://www.virustotal.com/gui/file/${errorHash}/detection`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Check on VirusTotal manually
                  </Button>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {securityResult && (
        <>
          <FileSecurityIndicator 
            result={securityResult} 
            fileHash={fileHash || undefined}
          />
          
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <ResultCard 
              title="File Details" 
              data={getFileDetails() || {}} 
            />
            
            <ResultCard 
              title="Security Analysis" 
              data={getSecurityDetails() || {}} 
            />
          </div>
        </>
      )}

      <div className="text-sm text-muted-foreground mt-4 bg-muted/40 p-3 rounded-md">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">About File Security Analysis:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>This feature uses client-side analysis of file properties to avoid CORS restrictions</li>
              <li>For a more comprehensive scan, use the direct link to VirusTotal when provided</li>
              <li>The analysis evaluates basic file properties including extension, size, and type</li>
              <li>This is not a comprehensive antivirus check - use caution with unknown files</li>
              <li>The analysis does not send your file to any external servers, preserving your privacy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSecurityForm;
