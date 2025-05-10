
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface CommentsByPlatformChartProps {
  data: Array<{ name: string; value: number }>;
  isLoading: boolean;
}

export function CommentsByPlatformChart({ data, isLoading }: CommentsByPlatformChartProps) {
  const COLORS = ["#8B5CF6", "#F97316", "#EF4444", "#10B981"];
  
  // Placeholder data when API returns empty data
  const placeholderData = [
    { name: "Instagram", value: 42 },
    { name: "Facebook", value: 28 },
    { name: "Google", value: 15 },
  ];

  const chartData = data?.length ? data : placeholderData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments by Platform</CardTitle>
        <CardDescription>
          Distribution of comments across social platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Skeleton className="h-[220px] w-[220px] rounded-full" />
          </div>
        ) : (
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={() => ""}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
