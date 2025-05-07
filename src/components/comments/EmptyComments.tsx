
import { Button } from "@/components/ui/button";
import { MessageSquareOff, RefreshCw } from "lucide-react";

export interface EmptyCommentsProps {
  status: string;
  onSync: () => void;
}

export function EmptyComments({ status, onSync }: EmptyCommentsProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/40 rounded-lg">
      <MessageSquareOff className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-medium text-lg mb-2">No {status} comments</h3>
      <p className="text-muted-foreground mb-4">
        {status === "pending"
          ? "There are no pending comments waiting for your attention."
          : `There are currently no ${status} comments.`}
      </p>
      <Button onClick={onSync}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Sync Comments
      </Button>
    </div>
  );
}

export default EmptyComments;
