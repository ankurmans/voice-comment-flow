
import { SocialAccount, BrandVoice } from "@/types";
import { Unlink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountCard } from "./AccountCard";

interface AccountsListProps {
  accounts: SocialAccount[] | undefined;
  isLoading: boolean;
  brandVoices: BrandVoice[] | undefined;
  onDisconnect: (account: SocialAccount) => void;
  onBrandVoiceUpdate: (account: SocialAccount) => void;
  onSwitchToConnectTab: () => void;
}

export function AccountsList({ 
  accounts, 
  isLoading, 
  brandVoices,
  onDisconnect, 
  onBrandVoiceUpdate,
  onSwitchToConnectTab
}: AccountsListProps) {
  // Get brand voice name from ID
  const getBrandVoiceName = (id?: string) => {
    if (!id || !brandVoices) return "None";
    const voice = brandVoices.find(v => v.id === id);
    return voice ? voice.name : "None";
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  } 
  
  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 mt-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Unlink className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No accounts connected</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
          Connect your social media accounts to monitor and respond to comments
        </p>
        <Button 
          className="mt-4"
          onClick={onSwitchToConnectTab}
        >
          <Plus className="mr-2 h-4 w-4" />
          Connect Account
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account: SocialAccount) => (
        <AccountCard 
          key={account.id}
          account={account} 
          onDisconnect={onDisconnect}
          onBrandVoiceUpdate={onBrandVoiceUpdate}
          getBrandVoiceName={getBrandVoiceName}
        />
      ))}
    </div>
  );
}
