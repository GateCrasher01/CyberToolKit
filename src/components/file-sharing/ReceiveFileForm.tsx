
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface ReceiveFileFormProps {
  port: string;
  setPort: (port: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  mockReceiveFile: (port: number, password: string) => Promise<void>;
}

const ReceiveFileForm = ({
  port,
  setPort,
  password,
  setPassword,
  isLoading,
  mockReceiveFile,
}: ReceiveFileFormProps) => {
  
  const handleReceiveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!port || !password) return;

    try {
      // Receive the file directly
      await mockReceiveFile(parseInt(port), password);
    } catch (error) {
      console.error("File receiving error:", error);
      toast.error(`File receiving error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <form onSubmit={handleReceiveFile} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="receive-port">Listening Port</Label>
        <Input
          id="receive-port"
          placeholder="Port to listen on (e.g. 5000)"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="receive-password">
          <div className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            Decryption Password
          </div>
        </Label>
        <Input
          id="receive-password"
          type="password"
          placeholder="Password for decryption"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Enter the same password used by the sender to encrypt the file.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!port || !password || isLoading}
      >
        Start Listening for Files
      </Button>
    </form>
  );
};

export default ReceiveFileForm;
