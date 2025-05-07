
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
  
  connect: async (platform: string, code: string) => {
    return fetchWithAuth("/social-accounts/connect", {
      method: "POST",
      body: JSON.stringify({ platform, code }),
    });
  },
  
  disconnect: async (accountId: string) => {
    return fetchWithAuth(`/social-accounts/${accountId}/disconnect`, {
      method: "POST",
    });
  }
};
