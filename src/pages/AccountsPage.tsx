import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialAccountsApi, brandVoiceApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { SocialAccount, BrandVoice } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Facebook,
  Instagram,
  RefreshCcw,
  Link2,
  Link2Off,
  AlertTriangle,
  Loader2,
  Plus,
  Unlink,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AccountsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<SocialAccount | null>(null);
  const [brandVoiceDialogOpen, setBrandVoiceDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [selectedBrandVoiceId, setSelectedBrandVoiceId] = useState<string>("");

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

  // Updated connect account function to use our Instagram edge function
  const connectAccount = (platform: string) => {
    if (platform === "instagram") {
      toast({
        title: "Connecting Instagram",
        description: "Redirecting to Instagram authentication...",
      });
      
      socialAccountsApi.connect(platform);
    } else {
      toast({
        title: "Connecting account",
        description: `Opening ${platform} authentication...`,
      });
      // In a real app, this would redirect to OAuth
      window.open(`/auth/${platform}`, "_blank");
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

  // Helper to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'facebook':
        return <Facebook className="h-6 w-6 social-icon social-icon-facebook" />;
      case 'instagram':
        return <Instagram className="h-6 w-6 social-icon social-icon-instagram" />;
      case 'google':
        return (
          <svg
            className="h-6 w-6 social-icon social-icon-google"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get brand voice name from ID
  const getBrandVoiceName = (id?: string) => {
    if (!id || !brandVoices) return "None";
    const voice = brandVoices.find(v => v.id === id);
    return voice ? voice.name : "None";
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Social Accounts</h1>
        <p className="text-muted-foreground">
          Connect and manage your social media accounts
        </p>
      </div>

      <Tabs defaultValue="connected">
        <TabsList>
          <TabsTrigger value="connected">Connected Accounts</TabsTrigger>
          <TabsTrigger value="connect">Connect New Account</TabsTrigger>
        </TabsList>
        
        {/* Connected Accounts Tab */}
        <TabsContent value="connected" className="mt-6">
          {isLoadingAccounts ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ) : accounts && accounts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account: SocialAccount) => (
                <Card key={account.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      {getPlatformIcon(account.platform)}
                      <div>
                        <CardTitle>{account.accountName}</CardTitle>
                        <CardDescription>
                          {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        {account.isConnected ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Disconnected
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Brand Voice:</span>
                        <span className="text-sm">{getBrandVoiceName(account.brandVoiceId)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Added:</span>
                        <span className="text-sm">{new Date(account.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openBrandVoiceDialog(account)}
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Brand Voice
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => openDisconnectDialog(account)}
                    >
                      <Link2Off className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
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
                onClick={() => {
                  const connectTab = document.querySelector('button[value="connect"]');
                  if (connectTab) {
                    (connectTab as HTMLButtonElement).click();
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Connect Account
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Connect New Account Tab */}
        <TabsContent value="connect" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-50">
                <div className="flex items-center space-x-3">
                  <Facebook className="h-8 w-8 social-icon social-icon-facebook" />
                  <CardTitle>Facebook</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Facebook Business account to monitor and respond to comments on your posts.
                </p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Monitor comments on Page posts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Auto-generate personalized replies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Track engagement metrics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => connectAccount("facebook")}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Facebook
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-pink-50">
                <div className="flex items-center space-x-3">
                  <Instagram className="h-8 w-8 social-icon social-icon-instagram" />
                  <CardTitle>Instagram</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Instagram Business account to monitor and respond to comments on your posts.
                </p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Reply to comments on posts and reels</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Generate context-aware responses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Boost engagement with timely replies</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => connectAccount("instagram")}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Instagram
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="bg-red-50">
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-8 w-8 social-icon social-icon-google"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <CardTitle>Google Reviews</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Google Business Profile to monitor and respond to customer reviews.
                </p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Respond to Google Business reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Create personalized review responses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Improve your local SEO with engagement</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => connectAccount("google")}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Google
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect {accountToDisconnect?.accountName}? CommentCrafter will no longer be able to monitor or respond to comments on this account.
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
              onClick={() => setDisconnectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
            >
              {disconnectMutation.isPending ? (
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

      {/* Brand Voice Dialog */}
      <Dialog open={brandVoiceDialogOpen} onOpenChange={setBrandVoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Brand Voice</DialogTitle>
            <DialogDescription>
              Select a brand voice to use for AI-generated replies for {selectedAccount?.accountName}.
            </DialogDescription>
          </DialogHeader>

          {isLoadingBrandVoices ? (
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
              onValueChange={setSelectedBrandVoiceId}
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
              onClick={() => setBrandVoiceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBrandVoiceUpdate}
              disabled={updateBrandVoiceMutation.isPending || isLoadingBrandVoices || !brandVoices || brandVoices.length === 0}
            >
              {updateBrandVoiceMutation.isPending ? (
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
    </div>
  );
};

export default AccountsPage;
