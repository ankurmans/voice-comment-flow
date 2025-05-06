
import { SocialAccount, BrandVoice } from "@/types";
import { Link2, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BrandVoiceDialogProps {
  open: boolean;
  account: SocialAccount | null;
  selectedBrandVoiceId: string;
  brandVoices: BrandVoice[] | undefined;
  isLoading: boolean;
  isUpdating: boolean;
  onOpenChange: (open: boolean) => void;
  onBrandVoiceSelect: (value: string) => void;
  onUpdate: () => void;
}

export function BrandVoiceDialog({
  open,
  account,
  selectedBrandVoiceId,
  brandVoices,
  isLoading,
  isUpdating,
  onOpenChange,
  onBrandVoiceSelect,
  onUpdate,
}: BrandVoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Brand Voice</DialogTitle>
          <DialogDescription>
            Select a brand voice to use for AI-generated replies for {account?.accountName}.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : !brandVoices || brandVoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-6">
            <p className="text-sm text-center text-muted-foreground mb-4">
              You haven't created any brand voices yet. Create a brand voice to define how your AI responds to comments.
            </p>
            <Button asChild>
              <a href="/brand-voice">
                <Plus className="mr-2 h-4 w-4" />
                Create Brand Voice
              </a>
            </Button>
          </div>
        ) : (
          <Select
            value={selectedBrandVoiceId}
            onValueChange={onBrandVoiceSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a brand voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {brandVoices.map((voice: BrandVoice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={onUpdate}
            disabled={isUpdating || isLoading || !brandVoices || brandVoices.length === 0}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Assign Voice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
