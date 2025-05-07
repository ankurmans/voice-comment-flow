
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  SettingsIcon,
  ShieldCheck,
  BellRing,
  CreditCard,
  User,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userDataApi } from "@/services/api";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AISettings } from "@/components/settings/AISettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import AutoReplySettings from "@/components/settings/AutoReplySettings";

const SettingsPage = () => {
  const { toast } = useToast();

  // Auto-Reply Settings handler
  const handleAutoReplySettingsSave = async (settings: any) => {
    try {
      // In production, this would call an API to save the settings
      await userDataApi.saveAutoReplySettings(settings);
      
      toast({
        title: "Auto-reply settings updated",
        description: "Your auto-reply configuration has been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "There was an error saving your auto-reply settings."
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-5 md:grid-cols-none md:flex">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <BellRing className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="ai-settings" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>AI Settings</span>
          </TabsTrigger>
          <TabsTrigger value="auto-reply" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Auto-Reply</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <ProfileSettings />
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai-settings" className="mt-6">
          <AISettings />
        </TabsContent>

        {/* Auto-Reply Tab */}
        <TabsContent value="auto-reply" className="mt-6">
          <AutoReplySettings onSave={handleAutoReplySettingsSave} />
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="mt-6">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
