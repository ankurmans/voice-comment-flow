
import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

interface ConnectPlatformCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  features: string[];
  bgClass: string;
  onConnect: () => void;
}

export function ConnectPlatformCard({
  title,
  icon,
  description,
  features,
  bgClass,
  onConnect,
}: ConnectPlatformCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className={bgClass}>
        <div className="flex items-center space-x-3">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow flex flex-col">
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <ul className="text-sm space-y-2 mb-4 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button 
          className="w-full"
          onClick={onConnect}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Connect {title}
        </Button>
      </CardFooter>
    </Card>
  );
}
