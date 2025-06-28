
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ResultCardProps {
  title: string;
  data: Record<string, any>;
  className?: string;
}

export function ResultCard({ title, data, className }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <Card className={cn("w-full overflow-hidden animate-scale-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8 rounded-full"
        >
          <Copy className={cn("h-4 w-4", copied ? "text-primary" : "")} />
          <span className="sr-only">Copy results</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key} className="border-b last:border-0">
                  <td className="py-3 px-4 font-medium text-muted-foreground">{key}</td>
                  <td className="py-3 px-4 break-words">
                    {typeof value === "string" && value.startsWith("http") ? (
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      String(value)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
