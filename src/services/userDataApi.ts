
import { fetchWithAuth } from "./fetchUtils";

export type AutoReplySettings = {
  enabled: boolean;
  confidenceThreshold: string;
  autoReplyCategories: string[];
  maxTimeInQueue: string;
  workingHoursOnly: boolean;
  maxDailyAutoReplies: string;
};

export const userDataApi = {
  // Fetch user profile data
  getProfile: async () => {
    return fetchWithAuth("/user/profile");
  },

  // Update user profile data
  updateProfile: async (profileData: any) => {
    return fetchWithAuth("/user/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  // Fetch auto-reply settings
  getAutoReplySettings: async () => {
    return fetchWithAuth<AutoReplySettings>("/user/settings/auto-reply");
  },

  // Update auto-reply settings
  saveAutoReplySettings: async (settings: AutoReplySettings) => {
    return fetchWithAuth<AutoReplySettings>("/user/settings/auto-reply", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },

  // Fetch notification preferences
  getNotificationPreferences: async () => {
    return fetchWithAuth("/user/settings/notifications");
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences: any) => {
    return fetchWithAuth("/user/settings/notifications", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },

  // Get privacy policy URL
  getPrivacyPolicyUrl: () => {
    return "https://www.privacypolicy.com"; // Replace with actual policy URL
  }
};
