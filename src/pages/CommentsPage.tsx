
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { CommentsFilter } from "@/components/comments/CommentsFilter";
import { CommentsList } from "@/components/comments/CommentsList";
import { EmptyComments } from "@/components/comments/EmptyComments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { commentsApi } from "@/services/api";

export default function CommentsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: "pending",
    platform: "all",
    accountId: "all",
    search: "",
    limit: 20,
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch comments based on filters
  const {
    data: commentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", filters, currentPage],
    queryFn: async () => {
      const response = await commentsApi.getAll(filters);
      if (response.status === "error") {
        throw new Error("Failed to load comments");
      }
      return response.data;
    },
  });

  // Sync comments mutation
  const syncMutation = useMutation({
    mutationFn: () => {
      return commentsApi.sync();
    },
    onSuccess: (response) => {
      if (response.status === "success") {
        toast({
          title: "Comments synced",
          description: `${response.data.newComments} new comments were found.`,
        });
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: "There was an error syncing your comments.",
      });
    },
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSync = () => {
    syncMutation.mutate();
  };
  
  const handleCommentUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["comments"] });
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render empty state if no comments
  if (!isLoading && !isError && commentsData?.comments.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
          <Button onClick={handleSync} disabled={syncMutation.isPending}>
            {syncMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Sync Comments
              </>
            )}
          </Button>
        </div>
        <EmptyComments status={filters.status} onSync={handleSync} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
          {!isLoading && !isError && commentsData && (
            <Badge variant="secondary" className="ml-2">
              {commentsData.totalCount} total
            </Badge>
          )}
        </div>
        <Button onClick={handleSync} disabled={syncMutation.isPending}>
          {syncMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Sync Comments
            </>
          )}
        </Button>
      </div>

      <CommentsFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onSync={handleSync}
        isSyncing={syncMutation.isPending}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          There was an error loading your comments.
        </div>
      ) : (
        <CommentsList 
          comments={commentsData.comments}
          status={filters.status}
          isLoading={isLoading}
          totalComments={commentsData.totalCount}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onSync={handleSync}
          onCommentUpdated={handleCommentUpdated}
        />
      )}
    </div>
  );
}
