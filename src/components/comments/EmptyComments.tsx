
import { Button } from "@/components/ui/button";
import { Filter, RefreshCcw } from "lucide-react";

interface EmptyCommentsProps {
  status: string;
  onSync: () => void;
}

export const EmptyComments = ({ status, onSync }: EmptyCommentsProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 mt-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Filter className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No comments found</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {status === "pending"
          ? "You've responded to all comments! Sync to check for new ones."
          : `No ${status} comments match your current filters.`}
      </p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onSync}
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Sync Comments
      </Button>
    </div>
  );
};

export default EmptyComments;
