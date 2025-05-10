
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  isLoading?: boolean;
  showPercentage?: boolean;
  percentageValue?: number;
  format?: (value: number | string) => string;
}

export function AnalyticsCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading = false,
  showPercentage = false,
  percentageValue,
  format = (val) => `${val}`
}: AnalyticsCardProps) {
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value}%`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className={`text-2xl font-bold ${showPercentage ? 'flex items-center' : ''}`}>
            {format(value)}
            {showPercentage && percentageValue !== undefined && (
              <>
                {percentageValue > 0 ? (
                  <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                ) : percentageValue < 0 ? (
                  <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
                ) : null}
              </>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
