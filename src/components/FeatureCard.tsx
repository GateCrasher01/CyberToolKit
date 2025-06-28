
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  href,
  className,
}: FeatureCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-lg border p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg neo-morphism",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-primary">{icon}</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="absolute bottom-2 right-2 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Explore →
      </span>
    </Link>
  );
}
