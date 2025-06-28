
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Lock, Upload, Download } from "lucide-react";
import { useMockFileOperations } from "@/hooks/useMockFileOperations";
import SendFileForm from "@/components/file-sharing/SendFileForm";
import ReceiveFileForm from "@/components/file-sharing/ReceiveFileForm";
import SecurityInfo from "@/components/file-sharing/SecurityInfo";

const FileSharing = () => {
  // Shared state
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5000");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    mockSendFile, 
    mockReceiveFile, 
    checkFileSecurityAsync, 
    isFileChecked, 
    isSecurityCheckLoading,
    securityResult,
    fileHash
  } = useMockFileOperations();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Secure File Sharing</h1>
        <p className="text-muted-foreground">
          Send and receive files with end-to-end encryption using password protection.
        </p>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Send File
          </TabsTrigger>
          <TabsTrigger value="receive" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Receive File
          </TabsTrigger>
        </TabsList>

        {/* Send File Tab */}
        <TabsContent value="send" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Send Encrypted File</CardTitle>
              </div>
              <CardDescription>
                Encrypt and send a file to another device securely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SendFileForm
                host={host}
                setHost={setHost}
                port={port}
                setPort={setPort}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                isFileChecked={isFileChecked}
                isSecurityCheckLoading={isSecurityCheckLoading}
                securityResult={securityResult}
                fileHash={fileHash}
                checkFileSecurityAsync={checkFileSecurityAsync}
                mockSendFile={mockSendFile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receive File Tab */}
        <TabsContent value="receive" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Receive Encrypted File</CardTitle>
              </div>
              <CardDescription>
                Listen for incoming files and decrypt them with your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiveFileForm
                port={port}
                setPort={setPort}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                mockReceiveFile={mockReceiveFile}
              />
            </CardContent>
            <CardFooter className="flex flex-col text-center bg-muted/30 rounded-b-lg">
              <p className="text-sm text-muted-foreground p-2">
                Once you click "Start Listening", the application will wait for an incoming file.
                Keep this window open until the file transfer is complete.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <SecurityInfo />
    </div>
  );
};

export default FileSharing;
