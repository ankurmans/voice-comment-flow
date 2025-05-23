
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SocialAccount, BrandVoice } from "@/types";
import { socialAccountsApi, brandVoiceApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export const useAccounts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);
  const [brandVoiceDialogOpen, setBrandVoiceDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [selectedBrandVoiceId, setSelectedBrandVoiceId] = useState<string>("none");

  // Query social accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const response = await socialAccountsApi.getAll();
      return response.data || [];
    },
    enabled: isAuthenticated, // Only run the query if the user is authenticated
  });

  // Query brand voices
  const { data: brandVoices, isLoading: isLoadingBrandVoices } = useQuery({
    queryKey: ["brand-voices"],
    queryFn: async () => {
      const response = await brandVoiceApi.getAll();
      if (response.status === "error") {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: isAuthenticated, // Only run the query if the user is authenticated
  });

  // Connect account function
  const connectAccount = (platform: string) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: `You must be logged in to connect ${platform}`,
      });
      return;
    }

    try {
      if (platform === "instagram") {
        toast({
          title: `Connecting ${platform}`,
          description: `Redirecting to ${platform} authentication...`,
        });
        
        socialAccountsApi.connect(platform);
      } else {
        // Mock connection for demo platforms
        toast({
          title: `${platform} integration`,
          description: `This is a demo. ${platform} integration would require a ${platform} Developer account.`,
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

  // Dialog handlers
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
    setSelectedBrandVoiceId(account.brandVoiceId || "none");
    setBrandVoiceDialogOpen(true);
  };

  const handleBrandVoiceUpdate = () => {
    if (selectedAccount) {
      updateBrandVoiceMutation.mutate({
        accountId: selectedAccount.id,
        brandVoiceId: selectedBrandVoiceId !== "none" ? selectedBrandVoiceId : "",
      });
    }
  };

  return {
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
  };
};
