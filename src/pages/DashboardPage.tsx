
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi, commentsApi, socialAccountsApi } from "@/services/api";

// Dashboard Components
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { CommentsByPlatformChart } from "@/components/dashboard/CommentsByPlatformChart";
import { EngagementGrowthChart } from "@/components/dashboard/EngagementGrowthChart";
import { PendingComments } from "@/components/dashboard/PendingComments";
import { ConnectedAccounts } from "@/components/dashboard/ConnectedAccounts";
import { ResponseSummary } from "@/components/dashboard/ResponseSummary";

const DashboardPage = () => {
  const [period, setPeriod] = useState<string>("week");

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const response = await socialAccountsApi.getAll();
      return response.data || [];
    }
  });

  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
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
    }
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

  const { data: pendingComments, isLoading: isLoadingComments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", "pending"],
    queryFn: async () => {
      const response = await commentsApi.getAll({ status: "pending", limit: 5 });
      return response.data?.comments || [];
    }
  });

  const syncComments = async () => {
    const result = await commentsApi.sync();
    if (result.status === "success") {
      refetchComments();
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard & Analytics</h1>
        <p className="text-muted-foreground">
          Overview of your social engagement performance
        </p>
      </div>

      {/* Time Period Selector */}
      <TimeRangeSelector period={period} setPeriod={setPeriod} />

      {/* Analytics Cards */}
      <AnalyticsCards analytics={analytics} isLoadingAnalytics={isLoadingAnalytics} />

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column */}
        <div className="md:col-span-8 space-y-6">
          {/* Analytics Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Comments by Platform Chart */}
            <CommentsByPlatformChart 
              data={platformData} 
              isLoading={isLoadingPlatformData} 
            />

            {/* Engagement Chart */}
            <EngagementGrowthChart 
              data={engagementData} 
              isLoading={isLoadingEngagementData} 
            />
          </div>

          {/* Pending Comments */}
          <PendingComments 
            comments={pendingComments} 
            isLoading={isLoadingComments} 
            onRefresh={syncComments} 
          />
        </div>

        {/* Right Column */}
        <div className="md:col-span-4 space-y-6">
          {/* Connected Accounts */}
          <ConnectedAccounts 
            accounts={accounts} 
            isLoading={isLoadingAccounts} 
          />

          {/* Response Performance Card */}
          <ResponseSummary />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
