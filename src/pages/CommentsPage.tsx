
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { commentsApi, socialAccountsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerationResponse } from "@/types";
import CommentsList from "@/components/comments/CommentsList";
import CommentsFilter from "@/components/comments/CommentsFilter";

const CommentsPage = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<string>("pending");
  const [filters, setFilters] = useState({
    platform: "",
    accountId: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Query for comments with current filters
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["comments", selectedTab, filters, currentPage],
    queryFn: async () => {
      const response = await commentsApi.getAll({
        status: selectedTab,
        platform: filters.platform,
        accountId: filters.accountId,
        page: currentPage,
        limit: itemsPerPage,
      });
      return response.data || { comments: [], total: 0, page: 1 };
    },
  });

  // Query for social accounts
  const { data: accounts } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const response = await socialAccountsApi.getAll();
      return response.data || [];
    },
  });

  // Sync comments mutation
  const syncCommentsMutation = useMutation({
    mutationFn: () => {
      return commentsApi.sync(filters.accountId || undefined);
    },
    onSuccess: (data) => {
      if (data.status === "success" && data.data) {
        toast({
          title: "Comments synced",
          description: `${data.data.count} new comments retrieved`,
        });
        refetchComments();
      } else {
        toast({
          variant: "destructive",
          title: "Sync failed",
          description: data.error || "Could not sync comments",
        });
      }
    },
  });

  const handleSyncComments = () => {
    syncCommentsMutation.mutate();
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Comments</h1>
        <p className="text-muted-foreground">
          Manage and respond to comments from all your connected platforms
        </p>
      </div>

      {/* Filters and Actions */}
      <CommentsFilter 
        filters={filters}
        setFilters={setFilters}
        accounts={accounts}
        onSync={handleSyncComments}
        isSyncing={syncCommentsMutation.isPending}
      />

      {/* Comments Tabs */}
      <Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
          <TabsTrigger value="skipped">Skipped</TabsTrigger>
          <TabsTrigger value="flagged">Flagged</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="mt-6">
          <CommentsList
            comments={commentsData?.comments}
            status={selectedTab}
            isLoading={isLoadingComments}
            totalComments={commentsData?.total || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onSync={handleSyncComments}
            onCommentUpdated={refetchComments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommentsPage;
