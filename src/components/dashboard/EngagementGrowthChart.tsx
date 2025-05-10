
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EngagementGrowthChartProps {
  data: Array<{ date: string; before: number; after: number }>;
  isLoading: boolean;
}

export function EngagementGrowthChart({ data, isLoading }: EngagementGrowthChartProps) {
  // Placeholder data when API returns empty data
  const placeholderData = [
    { date: "Mon", before: 15, after: 22 },
    { date: "Tue", before: 18, after: 26 },
    { date: "Wed", before: 20, after: 32 },
    { date: "Thu", before: 22, after: 36 },
    { date: "Fri", before: 16, after: 28 },
    { date: "Sat", before: 14, after: 24 },
    { date: "Sun", before: 16, after: 30 },
  ];

  const chartData = data?.length ? data : placeholderData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Growth</CardTitle>
        <CardDescription>
          Before vs after implementing replies
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="before"
                  name="Before"
                  fill="#8B5CF6"
                  opacity={0.5}
                />
                <Bar
                  dataKey="after"
                  name="After"
                  fill="#7E69AB"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
