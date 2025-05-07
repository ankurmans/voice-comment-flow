import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowDown, ArrowUp, MessageSquareText, ThumbsUp, BarChart3 } from "lucide-react";

const AnalyticsPage = () => {
  const [period, setPeriod] = useState<string>("week");

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["analytics-summary", period],
    queryFn: async () => {
      const response = await analyticsApi.getSummary(period);
      return response.data || {
        totalComments: 0,
        repliedComments: 0,
        skippedComments: 0,
        averageLikes: 0,
        engagementDelta: 0,
      };
    },
  });

  const { data: platformData, isLoading: isLoadingPlatformData } = useQuery({
    queryKey: ["analytics-platform", period],
    queryFn: async () => {
      const response = await analyticsApi.getCommentsByPlatform(period);
      return response.data || [];
    },
  });

  const { data: engagementData, isLoading: isLoadingEngagementData } = useQuery({
    queryKey: ["analytics-engagement", period],
    queryFn: async () => {
      const response = await analyticsApi.getEngagementMetrics(period);
      return response.data || [];
    },
  });

  // Placeholder data when API returns empty data
  const placeholderPlatformData = [
    { name: "Instagram", value: 42 },
    { name: "Facebook", value: 28 },
    { name: "Google", value: 15 },
  ];

  const placeholderEngagementData = [
    { date: "Mon", before: 15, after: 22 },
    { date: "Tue", before: 18, after: 26 },
    { date: "Wed", before: 20, after: 32 },
    { date: "Thu", before: 22, after: 36 },
    { date: "Fri", before: 16, after: 28 },
    { date: "Sat", before: 14, after: 24 },
    { date: "Sun", before: 16, after: 30 },
  ];

  // Chart colors
  const COLORS = ["#8B5CF6", "#F97316", "#EF4444", "#10B981"];
  
  // Format percentage with + sign for positive values
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value}%`;
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track the performance of your comment engagement strategy
        </p>
      </div>

      <Tabs
        defaultValue="week"
        value={period}
        onValueChange={setPeriod}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="day">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalComments || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Comments across all platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Rate
            </CardTitle>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {summary?.totalComments 
                  ? Math.round((summary?.repliedComments / summary?.totalComments) * 100) 
                  : 0}%
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Percentage of comments replied to
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Likes per Reply
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{summary?.averageLikes || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Average likes received on replies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Change
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="flex items-center text-2xl font-bold">
                {formatPercentage(summary?.engagementDelta || 0)}
                {summary?.engagementDelta && summary.engagementDelta > 0 ? (
                  <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                ) : summary?.engagementDelta && summary.engagementDelta < 0 ? (
                  <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
                ) : null}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Change in engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Comments by Platform</CardTitle>
            <CardDescription>
              Distribution of comments across social platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingPlatformData ? (
              <div className="flex justify-center">
                <Skeleton className="h-[300px] w-[300px] rounded-full" />
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData?.length ? platformData : placeholderPlatformData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {(platformData?.length ? platformData : placeholderPlatformData).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      labelFormatter={() => ""}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Engagement Before vs After Replies</CardTitle>
            <CardDescription>
              Comparing engagement metrics before and after implementing replies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEngagementData ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engagementData?.length ? engagementData : placeholderEngagementData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="before"
                      name="Before Replies"
                      fill="#8B5CF6"
                      opacity={0.5}
                    />
                    <Bar
                      dataKey="after"
                      name="After Replies"
                      fill="#7E69AB"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Response Performance</CardTitle>
          <CardDescription>
            Detailed metrics on how your AI-generated responses are performing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Platform</th>
                  <th scope="col" className="px-6 py-3">Comments</th>
                  <th scope="col" className="px-6 py-3">Replied</th>
                  <th scope="col" className="px-6 py-3">Response Rate</th>
                  <th scope="col" className="px-6 py-3">Avg. Response Time</th>
                  <th scope="col" className="px-6 py-3">Engagement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">Instagram</td>
                  <td className="px-6 py-4">42</td>
                  <td className="px-6 py-4">38</td>
                  <td className="px-6 py-4">90.5%</td>
                  <td className="px-6 py-4">4.2 hours</td>
                  <td className="px-6 py-4 text-green-600">+24%</td>
                </tr>
                <tr className="bg-gray-50 border-b">
                  <td className="px-6 py-4">Facebook</td>
                  <td className="px-6 py-4">28</td>
                  <td className="px-6 py-4">25</td>
                  <td className="px-6 py-4">89.3%</td>
                  <td className="px-6 py-4">3.8 hours</td>
                  <td className="px-6 py-4 text-green-600">+18%</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">Google Reviews</td>
                  <td className="px-6 py-4">15</td>
                  <td className="px-6 py-4">15</td>
                  <td className="px-6 py-4">100%</td>
                  <td className="px-6 py-4">2.4 hours</td>
                  <td className="px-6 py-4 text-green-600">+32%</td>
                </tr>
                <tr className="bg-gray-50 border-b font-medium">
                  <td className="px-6 py-4">Total</td>
                  <td className="px-6 py-4">85</td>
                  <td className="px-6 py-4">78</td>
                  <td className="px-6 py-4">91.8%</td>
                  <td className="px-6 py-4">3.7 hours</td>
                  <td className="px-6 py-4 text-green-600">+23%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
