
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { checkFileIntegrity, getSecurityRating } from "@/utils/virusTotalAPI";

export const useMockFileOperations = () => {
  const [isFileChecked, setIsFileChecked] = useState<boolean>(false);
  const [isSecurityCheckLoading, setIsSecurityCheckLoading] = useState<boolean>(false);
  const [securityResult, setSecurityResult] = useState<{
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
  } | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);

  // Check file integrity with our client-side approach
  const checkFileSecurityAsync = useCallback(async (file: File) => {
    if (!file) return;
    
    setIsSecurityCheckLoading(true);
    setIsFileChecked(false);
    setSecurityResult(null);
    setFileHash(null);
    
    try {
      const fileArrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileArrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFileHash(calculatedHash);
      
      const result = await checkFileIntegrity(file);
      
      if (result) {
        const rating = getSecurityRating(result);
        setSecurityResult(rating);
      } else {
        throw new Error("Unable to complete security check");
      }
    } catch (error) {
      console.error("Security check error:", error);
      throw error;
    } finally {
      setIsSecurityCheckLoading(false);
      setIsFileChecked(true);
    }
  }, []);

  const sendFile = useCallback(async (file: File, host: string, port: number, password: string) => {
    try {
      toast.loading("Connecting to receiver...");
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  
      const ws = new WebSocket(`${protocol}//${host}:${port}/send`);

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        toast.dismiss();
        toast.error("Failed to connect to receiver. Please check the host and port.");
        ws.close();
      };
      
      ws.onopen = () => {
        toast.dismiss();
        toast.loading("Preparing file for encryption...");
      
        const metadata = JSON.stringify({
          filename: file.name,
          password: password,
          size: file.size
        });
        
        ws.send(metadata);
   
        const reader = new FileReader();
        
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            toast.dismiss();
            toast.loading("Encrypting and sending file...");
            
            // Send file data
            ws.send(e.target.result);
            
            // Close after sending
            ws.close();
            toast.dismiss();
            toast.success(`File "${file.name}" sent successfully!`);
          }
        };
        
        reader.onerror = () => {
          toast.dismiss();
          toast.error("Error reading the file.");
          ws.close();
        };

        reader.readAsArrayBuffer(file);
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.error) {
          toast.dismiss();
          toast.error(response.error);
          ws.close();
        } else if (response.progress) {
          toast.dismiss();
          toast.loading(`Sending: ${response.progress}%`);
        }
      };
      
      ws.onclose = () => {
        console.log('Connection closed');
      };
    } catch (error) {
      toast.dismiss();
      console.error('Send file error:', error);
      toast.error(`Error sending file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, []);
  
  const receiveFile = useCallback(async (port: number, password: string) => {
    try {
      toast.loading("Starting file receiver...");
    
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      
      const ws = new WebSocket(`${protocol}//localhost:${port}/receive`);
   
      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        toast.dismiss();
        toast.error("Failed to start file receiver. Please check the port.");
        ws.close();
      };
      
      ws.onopen = () => {
        toast.dismiss();
        toast.loading("Waiting for incoming files...");

        const metadata = JSON.stringify({
          password: password
        });
        
        ws.send(metadata);
      };

      ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);
            
            if (data.filename) {
              toast.dismiss();
              toast.loading(`Receiving "${data.filename}"...`);
            } else if (data.progress) {
              toast.dismiss();
              toast.loading(`Receiving: ${data.progress}%`);
            } else if (data.complete) {
              toast.dismiss();
              toast.success(`File "${data.filename}" received and decrypted successfully!`);
      
              const fileBlob = new Blob([data.fileData], { type: 'application/octet-stream' });
              const url = URL.createObjectURL(fileBlob);
              const a = document.createElement('a');
              a.href = url;
              a.download = data.filename;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        } else {
          toast.dismiss();
          toast.loading("Decrypting received file...");
        }
      };

      ws.onclose = () => {
        console.log('Connection closed');
        toast.dismiss();
      };
    } catch (error) {
      toast.dismiss();
      console.error('Receive file error:', error);
      toast.error(`Error receiving file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, []);
  
  return { 
    mockSendFile: sendFile, 
    mockReceiveFile: receiveFile, 
    checkFileSecurityAsync,
    isFileChecked,
    isSecurityCheckLoading,
    securityResult,
    fileHash
  };
};
