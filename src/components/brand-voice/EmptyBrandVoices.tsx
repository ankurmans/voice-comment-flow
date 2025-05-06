
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";

interface EmptyBrandVoicesProps {
  onCreateClick: () => void;
}

export const EmptyBrandVoices = ({ onCreateClick }: EmptyBrandVoicesProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 mt-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <MessageSquare className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No brand voices</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
        Create a brand voice to define how your AI should respond to comments. Your brand voice guides the tone and personality of generated replies.
      </p>
      <Button className="mt-4" onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Create Your First Brand Voice
      </Button>
    </div>
  );
};
