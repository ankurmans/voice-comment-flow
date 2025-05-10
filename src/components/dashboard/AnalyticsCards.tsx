
import { AnalyticsCard } from "./AnalyticsCard";
import { MessageSquareText, ThumbsUp, BarChart3 } from "lucide-react";

interface AnalyticsCardsProps {
  analytics: any;
  isLoadingAnalytics: boolean;
}

export function AnalyticsCards({ analytics, isLoadingAnalytics }: AnalyticsCardsProps) {
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <AnalyticsCard
        title="Total Comments"
        value={analytics?.totalComments || 0}
        description="All comments across platforms"
        icon={MessageSquareText}
        isLoading={isLoadingAnalytics}
      />
      
      <AnalyticsCard
        title="Reply Rate"
        value={analytics?.totalComments 
          ? Math.round((analytics?.repliedComments / analytics?.totalComments) * 100) 
          : 0}
        description="Percentage of comments replied to"
        icon={ThumbsUp}
        isLoading={isLoadingAnalytics}
        format={(value) => `${value}%`}
      />
      
      <AnalyticsCard
        title="Avg. Likes per Reply"
        value={analytics?.averageLikes || 0}
        description="Average likes received on replies"
        icon={ThumbsUp}
        isLoading={isLoadingAnalytics}
      />
      
      <AnalyticsCard
        title="Engagement Change"
        value={analytics?.engagementDelta || 0}
        description="Change in engagement rate"
        icon={BarChart3}
        isLoading={isLoadingAnalytics}
        showPercentage={true}
        percentageValue={analytics?.engagementDelta}
        format={formatPercentage}
      />
    </div>
  );
}
