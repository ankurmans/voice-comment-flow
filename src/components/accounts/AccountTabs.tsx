
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountsList } from "@/components/accounts/AccountsList";
import { ConnectPlatformsSection } from "@/components/accounts/ConnectPlatformsSection";
import { SocialAccount, BrandVoice } from "@/types";

interface AccountTabsProps {
  accounts: SocialAccount[] | undefined;
  isLoadingAccounts: boolean;
  brandVoices: BrandVoice[] | undefined;
  onDisconnect: (account: SocialAccount) => void;
  onBrandVoiceUpdate: (account: SocialAccount) => void;
  onConnectPlatform: (platform: string) => void;
}

export function AccountTabs({
  accounts,
  isLoadingAccounts,
  brandVoices,
  onDisconnect,
  onBrandVoiceUpdate,
  onConnectPlatform
}: AccountTabsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("connected");

  // Set the active tab based on URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam === "connect") {
      setActiveTab("connect");
    }
  }, [location.search]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without full page refresh
    navigate(`/accounts${value === "connect" ? "?tab=connect" : ""}`, { replace: true });
  };

  const handleSwitchToConnectTab = () => {
    const connectTab = document.querySelector('button[value="connect"]');
    if (connectTab) {
      (connectTab as HTMLButtonElement).click();
    }
  };

  return (
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
          onDisconnect={onDisconnect}
          onBrandVoiceUpdate={onBrandVoiceUpdate}
          onSwitchToConnectTab={handleSwitchToConnectTab}
        />
      </TabsContent>
      
      {/* Connect New Account Tab */}
      <TabsContent value="connect" className="mt-6">
        <ConnectPlatformsSection 
          onConnectPlatform={onConnectPlatform} 
        />
      </TabsContent>
    </Tabs>
  );
}
