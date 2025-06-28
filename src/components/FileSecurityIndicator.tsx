
import React from "react";
import { AlertCircle, CheckCircle, ExternalLink, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FileSecurityIndicatorProps {
  result: {
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
  };
  fileHash?: string;
  className?: string;
}

const FileSecurityIndicator: React.FC<FileSecurityIndicatorProps> = ({ result, fileHash, className }) => {
  const hasDetections = result.detectionDetails && result.detectionDetails.length > 0;
  
  return (
    <Alert 
      className={`${className} border-l-4`}
      style={{ borderLeftColor: result.color }}
    >
      <div className="flex items-start gap-2">
        {result.rating === "safe" ? (
          <CheckCircle className="h-5 w-5" style={{ color: result.color }} />
        ) : (
          <AlertCircle className="h-5 w-5" style={{ color: result.color }} />
        )}
        <div className="flex-1">
          <AlertTitle className="text-sm font-medium" style={{ color: result.color }}>
            {result.rating === "safe" ? "File is safe" : result.rating === "suspicious" ? "File is suspicious" : "File is malicious"}
            {result.stats && result.stats.detections > 0 && (
              <span className="ml-1 font-normal">
                ({result.stats.detections}/{result.stats.totalVendors} security vendors flagged this file)
              </span>
            )}
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            {result.message}
          </AlertDescription>
          
          {hasDetections && (
            <div className="mt-2 bg-muted/50 rounded-md p-2 text-xs max-h-48 overflow-y-auto">
              <div className="font-medium mb-1">Security Vendor Detections:</div>
              <Table>
                <TableBody>
                  {result.detectionDetails.map((detail, index) => (
                    <TableRow key={index} className="border-t border-muted">
                      <TableCell className="py-1 px-2 font-medium">{detail.vendorName}</TableCell>
                      <TableCell className="py-1 px-2">{detail.detection}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {fileHash && (
            <div className="mt-2 flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => window.open(`https://www.virustotal.com/gui/file/${fileHash}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View full report
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View detailed analysis on VirusTotal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default FileSecurityIndicator;
