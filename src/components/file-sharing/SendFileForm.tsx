
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Lock, Shield } from "lucide-react";
import FileSecurityIndicator from "@/components/FileSecurityIndicator";
import { toast } from "sonner";

interface SendFileFormProps {
  host: string;
  setHost: (host: string) => void;
  port: string;
  setPort: (port: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isFileChecked: boolean;
  isSecurityCheckLoading: boolean;
  securityResult: {
    rating: "safe" | "suspicious" | "malicious";
    color: string;
    message: string;
  } | null;
  fileHash: string | null;
  checkFileSecurityAsync: (file: File) => Promise<void>;
  mockSendFile: (file: File, host: string, port: number, password: string) => Promise<void>;
}

const SendFileForm = ({
  host,
  setHost,
  port,
  setPort,
  password,
  setPassword,
  isLoading,
  selectedFile,
  setSelectedFile,
  isFileChecked,
  isSecurityCheckLoading,
  securityResult,
  fileHash,
  checkFileSecurityAsync,
  mockSendFile,
}: SendFileFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleSendFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!host || !port || !password || !selectedFile) return;

    try {
      // Send the file directly
      await mockSendFile(selectedFile, host, parseInt(port), password);
      
      // Reset form after successful upload
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("File sending error:", error);
      toast.error(`File sending error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleCheckFileSecurity = async () => {
    if (!selectedFile) return;
    await checkFileSecurityAsync(selectedFile);
  };

  return (
    <form onSubmit={handleSendFile} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="send-host">Host Address</Label>
          <Input
            id="send-host"
            placeholder="Recipient's host (e.g. localhost)"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="send-port">Port Number</Label>
          <Input
            id="send-port"
            placeholder="Port (e.g. 5000)"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="send-password">
          <div className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            Encryption Password
          </div>
        </Label>
        <Input
          id="send-password"
          type="password"
          placeholder="Secure password for encryption"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Use a strong password that the recipient knows. This will be used to encrypt the file.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Select File</Label>
        <Input
          id="file"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="cursor-pointer"
          required
        />
      </div>

      {selectedFile && (
        <div className="text-sm bg-muted rounded-md p-3 mt-2">
          <p><span className="font-medium">Selected file:</span> {selectedFile.name}</p>
          <p><span className="font-medium">Size:</span> {(selectedFile.size / 1024).toFixed(2)} KB</p>
          {!isFileChecked && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleCheckFileSecurity}
              disabled={isSecurityCheckLoading}
            >
              <Shield className="h-4 w-4 mr-1" /> Check file security
            </Button>
          )}
          {securityResult && (
            <FileSecurityIndicator 
              result={securityResult} 
              fileHash={fileHash || undefined}
              className="mt-2" 
            />
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!host || !port || !password || !selectedFile || isLoading}
      >
        Send Encrypted File
      </Button>
    </form>
  );
};

export default SendFileForm;
