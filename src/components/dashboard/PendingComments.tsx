
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw, ArrowRight, MessageSquareText } from "lucide-react";
import { PendingCommentItem } from "./PendingCommentItem";

interface PendingCommentsProps {
  comments: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function PendingComments({ comments, isLoading, onRefresh }: PendingCommentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Comments</CardTitle>
          <CardDescription>
            Comments waiting for your response
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => (
              <PendingCommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
            <MessageSquareText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-semibold">No pending comments</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              All your comments have been addressed
            </p>
            <Button variant="outline" onClick={onRefresh} className="mt-4">
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
  );
}
