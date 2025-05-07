import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi, commentsApi, socialAccountsApi } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialAccount } from "@/types";
import { ArrowRight, Facebook, Instagram, RefreshCcw, MessageSquareText, ThumbsUp, BarChart3, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    queryKey: ["analytics", period],
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

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5 social-icon social-icon-facebook" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 social-icon social-icon-instagram" />;
      case 'google':
        return (
          <svg
            className="h-5 w-5 social-icon social-icon-google"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your social engagement activities
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.totalComments || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              All comments across platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reply Rate
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {analytics?.totalComments 
                  ? Math.round((analytics?.repliedComments / analytics?.totalComments) * 100) 
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
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.averageLikes || 0}</div>
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
            {isLoadingAnalytics ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {analytics?.engagementDelta > 0 ? "+" : ""}
                {analytics?.engagementDelta || 0}%
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Change in engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Social accounts linked to CommentCrafter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAccounts ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : accounts && accounts.length > 0 ? (
              <div className="space-y-2">
                {accounts.map((account: SocialAccount) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center space-x-3">
                      {getPlatformIcon(account.platform)}
                      <div>
                        <p className="font-medium">{account.accountName}</p>
                        <p className="text-xs text-muted-foreground">
                          {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div>
                      {account.isConnected ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Disconnected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-semibold">No accounts connected</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Connect your social accounts to start managing comments
                </p>
                <Button asChild className="mt-4">
                  <Link to="/accounts">Connect Accounts</Link>
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to="/accounts">
                Manage Accounts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Pending Comments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Comments</CardTitle>
              <CardDescription>
                Comments waiting for your response
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={syncComments}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingComments ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : pendingComments && pendingComments.length > 0 ? (
              <div className="space-y-3">
                {pendingComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex flex-col space-y-2 rounded-md border p-3 comment-card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(comment.platform)}
                        <span className="font-medium truncate">
                          {comment.commentAuthor}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.commentTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.commentContent}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                <MessageSquareText className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-semibold">No pending comments</h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  All your comments have been addressed
                </p>
                <Button variant="outline" onClick={syncComments} className="mt-4">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Sync Comments
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/comments">
                View All Comments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
