
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAccounts } from "@/hooks/useAccounts";
import { AccountTabs } from "@/components/accounts/AccountTabs";
import { DisconnectAccountDialog } from "@/components/accounts/DisconnectAccountDialog";
import { BrandVoiceDialog } from "@/components/accounts/BrandVoiceDialog";

const AccountsPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const {
    accounts,
    isLoadingAccounts,
    brandVoices,
    isLoadingBrandVoices,
    disconnectDialogOpen,
    setDisconnectDialogOpen,
    accountToDisconnect,
    brandVoiceDialogOpen,
    setBrandVoiceDialogOpen,
    selectedAccount,
    selectedBrandVoiceId,
    setSelectedBrandVoiceId,
    disconnectMutation,
    updateBrandVoiceMutation,
    connectAccount,
    openDisconnectDialog,
    handleDisconnect,
    openBrandVoiceDialog,
    handleBrandVoiceUpdate
  } = useAccounts();

  // Check for successful connection on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const connected = params.get("connected");
    const error = params.get("error");
    
    if (connected) {
      toast({
        title: `${connected.charAt(0).toUpperCase() + connected.slice(1)} Connected`,
        description: `Your ${connected} account was successfully connected.`,
      });
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error || "Failed to connect account.",
      });
    }
  }, [location.search, toast]);

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Social Accounts</h1>
        <p className="text-muted-foreground">
          Connect and manage your social media accounts
        </p>
      </div>

      <AccountTabs
        accounts={accounts}
        isLoadingAccounts={isLoadingAccounts}
        brandVoices={brandVoices}
        onDisconnect={openDisconnectDialog}
        onBrandVoiceUpdate={openBrandVoiceDialog}
        onConnectPlatform={connectAccount}
      />

      {/* Disconnect Account Dialog */}
      <DisconnectAccountDialog 
        open={disconnectDialogOpen}
        account={accountToDisconnect}
        isDisconnecting={disconnectMutation.isPending}
        onOpenChange={setDisconnectDialogOpen}
        onDisconnect={handleDisconnect}
      />

      {/* Brand Voice Dialog */}
      <BrandVoiceDialog
        open={brandVoiceDialogOpen}
        account={selectedAccount}
        selectedBrandVoiceId={selectedBrandVoiceId}
        brandVoices={brandVoices}
        isLoading={isLoadingBrandVoices}
        isUpdating={updateBrandVoiceMutation.isPending}
        onOpenChange={setBrandVoiceDialogOpen}
        onBrandVoiceSelect={setSelectedBrandVoiceId}
        onUpdate={handleBrandVoiceUpdate}
      />
    </div>
  );
};

export default AccountsPage;
