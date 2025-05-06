
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { repliesApi, commentsApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Comment, GenerationResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Loader2,
  Check,
  Facebook,
  Instagram,
  ThumbsUp,
  ThumbsDown,
  SendHorizontal,
  Wand2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommentCardProps {
  comment: Comment;
  onCommentUpdated: () => void;
}

export const CommentCard = ({ comment, onCommentUpdated }: CommentCardProps) => {
  const { toast } = useToast();
  const [selectedReply, setSelectedReply] = useState<string>("");
  const [customReply, setCustomReply] = useState<string>("");
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Generate replies mutation
  const generateRepliesMutation = useMutation({
    mutationFn: (commentId: string) => {
      return repliesApi.generateReplies({ commentId, options: { count: 3 } });
    },
    onSuccess: (data) => {
      if (data.status === "success" && data.data) {
        toast({
          title: "Replies generated",
          description: "AI has suggested replies for this comment",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation failed",
          description: data.error || "Could not generate replies",
        });
      }
    },
  });

  // Post reply mutation
  const postReplyMutation = useMutation({
    mutationFn: (params: { commentId: string; content: string }) => {
      return repliesApi.saveReply(params.commentId, params.content);
    },
    onSuccess: (data) => {
      if (data.status === "success" && data.data) {
        toast({
          title: "Reply saved",
          description: "Your reply has been saved and is ready to post",
        });
        onCommentUpdated();
      } else {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: data.error || "Could not save reply",
        });
      }
    },
  });

  // Mark comment as skipped mutation
  const skipCommentMutation = useMutation({
    mutationFn: (commentId: string) => {
      return commentsApi.updateStatus(commentId, "skipped");
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        toast({
          title: "Comment skipped",
          description: "This comment has been marked as skipped",
        });
        onCommentUpdated();
      }
    },
  });

  // Handle generating replies
  const handleGenerateReplies = async () => {
    setLoadingReplies(true);
    try {
      const result = await generateRepliesMutation.mutateAsync(comment.id);
      if (result.status === "success" && result.data) {
        // Type assertion to ensure we can access the suggestions property
        const responseData = result.data as GenerationResponse;
        setSuggestedReplies(responseData.suggestions);
      }
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplySubmit = () => {
    const content = selectedReply || customReply;
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Empty reply",
        description: "Please enter a reply or select a suggestion",
      });
      return;
    }

    postReplyMutation.mutate({
      commentId: comment.id,
      content,
    });
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

  const getIntentBadge = (intent?: string) => {
    if (!intent) return null;

    const intentColors: Record<string, string> = {
      compliment: "bg-green-100 text-green-800",
      question: "bg-blue-100 text-blue-800",
      tag: "bg-purple-100 text-purple-800",
      emoji: "bg-yellow-100 text-yellow-800",
      negative: "bg-red-100 text-red-800",
      spam: "bg-gray-100 text-gray-800",
      other: "bg-slate-100 text-slate-800",
    };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${intentColors[intent] || ""}`}>
        {intent}
      </span>
    );
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPlatformIcon(comment.platform)}
            <CardTitle className="text-base font-medium">
              {comment.commentAuthor}
            </CardTitle>
            {comment.commentIntent && getIntentBadge(comment.commentIntent)}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">
              {new Date(comment.commentTimestamp).toLocaleString()}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => skipCommentMutation.mutate(comment.id)}>
                  Mark as skipped
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a 
                    href={`https://example.com/${comment.platform}/post/${comment.postId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center w-full"
                  >
                    View original post
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Original Post Context (if available) */}
        {comment.postContent && (
          <div className="mb-3 rounded bg-muted/30 p-2 text-sm">
            <p className="font-medium text-xs text-muted-foreground mb-1">Original Post:</p>
            <p>{comment.postContent}</p>
          </div>
        )}

        {/* Comment Content */}
        <div className="mb-4">
          <p className="text-sm">{comment.commentContent}</p>
        </div>

        <Separator className="my-4" />

        {/* Reply Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Your Response</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGenerateReplies}
              disabled={loadingReplies}
            >
              {loadingReplies ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Suggestions
            </Button>
          </div>

          {/* AI Suggestions */}
          {suggestedReplies.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">AI Suggestions:</p>
              <div className="grid gap-2">
                {suggestedReplies.map((reply, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                      selectedReply === reply 
                        ? "border-primary bg-primary/10" 
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => {
                      setSelectedReply(reply === selectedReply ? "" : reply);
                      if (reply !== selectedReply) setCustomReply("");
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <p>{reply}</p>
                      {selectedReply === reply && (
                        <Check className="h-4 w-4 text-primary mt-1 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Reply Input */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              {selectedReply ? "Edit selected reply:" : "Write your own reply:"}
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your reply here..."
                value={selectedReply || customReply}
                onChange={(e) => {
                  if (selectedReply) {
                    setSelectedReply(e.target.value);
                  } else {
                    setCustomReply(e.target.value);
                  }
                }}
                className="flex-1"
              />
              <Button 
                onClick={handleReplySubmit}
                disabled={postReplyMutation.isPending}
              >
                {postReplyMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="mr-2 h-4 w-4" />
                )}
                Reply
              </Button>
            </div>
          </div>

          {/* Feedback Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm">
              <ThumbsDown className="mr-2 h-4 w-4" />
              Not Helpful
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              Helpful
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
