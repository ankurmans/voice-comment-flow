
import { Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentCard } from "./CommentCard";
import EmptyComments from "./EmptyComments";

interface CommentsListProps {
  comments?: Comment[];
  status: string;
  isLoading: boolean;
  totalComments: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSync: () => void;
  onCommentUpdated: () => void;
}

export const CommentsList = ({
  comments,
  status,
  isLoading,
  totalComments,
  currentPage,
  itemsPerPage,
  onPageChange,
  onSync,
  onCommentUpdated,
}: CommentsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return <EmptyComments status={status} onSync={onSync} />;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard 
          key={comment.id} 
          comment={comment} 
          onCommentUpdated={onCommentUpdated} 
        />
      ))}
      
      {/* Pagination */}
      {totalComments > itemsPerPage && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {Math.ceil(totalComments / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalComments / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
