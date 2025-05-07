
import { fetchWithAuth } from "./fetchUtils";
import { mockDataService } from "./mockDataService";

export const socialAccountsApi = {
  getAll: async () => {
    // Return mock data instead of making an API call
    return {
      data: mockDataService.getSocialAccounts(),
      status: "success"
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth("/social-accounts");
  },
  
  connect: async (platform: string) => {
    // For demo purposes, simulate a successful connection
    console.log(`Connecting to ${platform}...`);
    return {
      status: "success",
      data: { message: `Connected to ${platform}` }
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth("/social-accounts/connect", {
    //   method: "POST",
    //   body: JSON.stringify({ platform, code }),
    // });
  },
  
  disconnect: async (accountId: string) => {
    return fetchWithAuth(`/social-accounts/${accountId}/disconnect`, {
      method: "POST",
    });
  },

  updateBrandVoice: async (accountId: string, brandVoiceId: string) => {
    // For demo purposes, simulate a successful update
    console.log(`Updating brand voice for account ${accountId} to ${brandVoiceId}`);
    return {
      status: "success",
      data: { message: "Brand voice updated successfully" }
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth(`/social-accounts/${accountId}/brand-voice`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ brandVoiceId }),
    // });
  }
};
