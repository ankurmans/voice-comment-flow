
import { SocialAccount } from "@/types";
import { AlertTriangle, Link2Off, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DisconnectAccountDialogProps {
  open: boolean;
  account: SocialAccount | null;
  isDisconnecting: boolean;
  onOpenChange: (open: boolean) => void;
  onDisconnect: () => void;
}

export function DisconnectAccountDialog({
  open,
  account,
  isDisconnecting,
  onOpenChange,
  onDisconnect,
}: DisconnectAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to disconnect {account?.accountName}? CommentCrafter will no longer be able to monitor or respond to comments on this account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 rounded-md border p-4 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm">
            You can reconnect the account at any time, but any pending replies will be lost.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <Link2Off className="mr-2 h-4 w-4" />
                Disconnect
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
