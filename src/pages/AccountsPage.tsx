
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { socialAccountsApi, brandVoiceApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { SocialAccount } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Components
import { AccountsList } from "@/components/accounts/AccountsList";
import { ConnectPlatformsSection } from "@/components/accounts/ConnectPlatformsSection";
import { DisconnectAccountDialog } from "@/components/accounts/DisconnectAccountDialog";
import { BrandVoiceDialog } from "@/components/accounts/BrandVoiceDialog";

const AccountsPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);
  const [brandVoiceDialogOpen, setBrandVoiceDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [selectedBrandVoiceId, setSelectedBrandVoiceId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("connected");

  // Set the active tab based on URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "connect") {
      setActiveTab("connect");
    }
  }, [location.search]);

  // Query social accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const response = await socialAccountsApi.getAll();
      return response.data || [];
    },
  });

  // Query brand voices
  const { data: brandVoices, isLoading: isLoadingBrandVoices } = useQuery({
    queryKey: ["brand-voices"],
    queryFn: async () => {
      const response = await brandVoiceApi.getAll();
      return response.data || [];
    },
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without full page refresh
    navigate(`/accounts${value === "connect" ? "?tab=connect" : ""}`, { replace: true });
  };

  // Connect account function
  const connectAccount = (platform: string) => {
    try {
      if (platform === "instagram") {
        toast({
          title: `Connecting ${platform}`,
          description: `Redirecting to ${platform} authentication...`,
        });
        
        socialAccountsApi.connect(platform);
      } else if (platform === "facebook") {
        // Mock Facebook connection for demo
        toast({
          title: "Facebook integration",
          description: "This is a demo. Facebook integration would require a Facebook Developer account.",
        });
        
        // Simulate successful connection for demo
        window.location.href = `${window.location.origin}/accounts?connected=${platform}`;
      } else if (platform === "google") {
        // Mock Google connection for demo
        toast({
          title: "Google integration",
          description: "This is a demo. Google integration would require a Google Developer account.",
        });
        
        // Simulate successful connection for demo
        window.location.href = `${window.location.origin}/accounts?connected=${platform}`;
      }
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({
        variant: "destructive",
        title: `Connection to ${platform} failed`,
        description: "Please try again later",
      });
    }
  };

  // Mutations
  const disconnectMutation = useMutation({
    mutationFn: (accountId: string) => {
      return socialAccountsApi.disconnect(accountId);
    },
    onSuccess: () => {
      toast({
        title: "Account disconnected",
        description: "Social account has been disconnected successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
      setDisconnectDialogOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to disconnect",
        description: "There was an error disconnecting the account",
      });
    },
  });

  const updateBrandVoiceMutation = useMutation({
    mutationFn: ({ accountId, brandVoiceId }: { accountId: string; brandVoiceId: string }) => {
      return socialAccountsApi.updateBrandVoice(accountId, brandVoiceId);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice updated",
        description: "Brand voice has been assigned to the account",
      });
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
      setBrandVoiceDialogOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "There was an error updating the brand voice",
      });
    },
  });

  const openDisconnectDialog = (account: SocialAccount) => {
    setAccountToDisconnect(account);
    setDisconnectDialogOpen(true);
  };

  const handleDisconnect = () => {
    if (accountToDisconnect) {
      disconnectMutation.mutate(accountToDisconnect.id);
    }
  };

  const openBrandVoiceDialog = (account: SocialAccount) => {
    setSelectedAccount(account);
    setSelectedBrandVoiceId(account.brandVoiceId || "");
    setBrandVoiceDialogOpen(true);
  };

  const handleBrandVoiceUpdate = () => {
    if (selectedAccount) {
      updateBrandVoiceMutation.mutate({
        accountId: selectedAccount.id,
        brandVoiceId: selectedBrandVoiceId,
      });
    }
  };

  const handleSwitchToConnectTab = () => {
    const connectTab = document.querySelector('button[value="connect"]');
    if (connectTab) {
      (connectTab as HTMLButtonElement).click();
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Social Accounts</h1>
        <p className="text-muted-foreground">
          Connect and manage your social media accounts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
          <TabsTrigger value="connect">Connect New Account</TabsTrigger>
        </TabsList>
        
        {/* Connected Accounts Tab */}
        <TabsContent value="connected" className="mt-6">
          <AccountsList 
            accounts={accounts}
            isLoading={isLoadingAccounts}
            brandVoices={brandVoices}
            onDisconnect={openDisconnectDialog}
            onBrandVoiceUpdate={openBrandVoiceDialog}
            onSwitchToConnectTab={handleSwitchToConnectTab}
          />
        </TabsContent>
        
        {/* Connect New Account Tab */}
        <TabsContent value="connect" className="mt-6">
          <ConnectPlatformsSection 
            onConnectPlatform={connectAccount} 
          />
        </TabsContent>
      </Tabs>

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
