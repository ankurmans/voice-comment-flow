
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, MessageSquare, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/types";
import { commentsApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

type CommentCardProps = {
  comment: Comment;
  onCommentUpdated: () => void;
};

export function CommentCard({ comment, onCommentUpdated }: CommentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  // Platform badge color mapping
  const platformColorMap: Record<string, string> = {
    instagram: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    youtube: "bg-red-600 hover:bg-red-700",
    twitter: "bg-blue-500 hover:bg-blue-600",
    facebook: "bg-blue-600 hover:bg-blue-700",
    tiktok: "bg-black hover:bg-gray-800",
    default: "bg-gray-600 hover:bg-gray-700",
    google: "bg-red-500 hover:bg-red-600",
  };

  // Status badge color mapping
  const statusColorMap: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    approved: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    rejected: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    replied: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    skipped: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
    flagged: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    default: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  };

  // Update comment status mutation
  const statusMutation = useMutation({
    mutationFn: ({ commentId, status }: { commentId: string; status: string }) => {
      return commentsApi.changeStatus(commentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast({
        title: "Status updated",
        description: "Comment status has been updated successfully.",
      });
      onCommentUpdated();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the comment status.",
      });
    },
  });

  const handleStatusUpdate = (status: string) => {
    statusMutation.mutate({ commentId: comment.id, status });
  };

  // Extract author name from commentAuthor property
  const authorName = comment.commentAuthor || "Anonymous";
  const commentContent = comment.commentContent || "";
  // Calculate reply count (if exists) or default to 0
  const replyCount = 0; // Since replies aren't implemented yet, default to 0

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.commentAuthorId}`} alt={authorName} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{authorName}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(comment.commentTimestamp), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={`${
                platformColorMap[comment.platform] || platformColorMap.default
              } text-white`}
            >
              {comment.platform}
            </Badge>
            <Badge
              className={statusColorMap[comment.status] || statusColorMap.default}
            >
              {comment.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusUpdate("replied")}>
                  Mark as Replied
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate("skipped")}>
                  Skip
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Generate Reply</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Comment content */}
        <div className={`text-sm ${isExpanded ? "" : "line-clamp-3"}`}>
          {commentContent}
        </div>
        {commentContent.length > 150 && (
          <Button
            variant="link"
            className="p-0 h-auto text-xs mt-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>
              {replyCount === 0
                ? "No replies"
                : replyCount === 1
                ? "1 reply"
                : `${replyCount} replies`}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Reply
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CommentCard;
