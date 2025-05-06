
import { SocialAccount, ApiResponse } from "../types";
import { fetchWithAuth } from "./fetchUtils";

// Add the base URL for our Supabase Edge Function
const EDGE_FUNCTION_URL = "https://dedialilbuseilgqgmeh.supabase.co/functions/v1";

export const socialAccountsApi = {
  getAll: async () => {
    return fetchWithAuth<SocialAccount[]>("/accounts");
  },
  
  connect: async (platform: string) => {
    if (platform === "instagram") {
      // For Instagram, we need to get the auth token and redirect to the edge function
      const token = localStorage.getItem("auth_token");
      if (!token) {
        return { 
          error: "You must be logged in to connect an account", 
          status: "error" as const
        };
      }
      
      // Redirect to the Instagram auth edge function with the token in the URL
      window.location.href = `${EDGE_FUNCTION_URL}/instagram-auth/authorize?token=${encodeURIComponent(token)}`;
      
      // This is a redirect, so we don't return a response
      return { status: "redirect" as const };
    }
    
    // For other platforms, we'll use the mock implementation
    return fetchWithAuth<SocialAccount>("/accounts/connect", {
      method: "POST",
      body: JSON.stringify({ platform }),
    });
  },
  
  disconnect: async (accountId: string) => {
    return fetchWithAuth<{ success: boolean }>(`/accounts/${accountId}/disconnect`, {
      method: "POST",
    });
  },
  
  updateBrandVoice: async (accountId: string, brandVoiceId: string) => {
    return fetchWithAuth<SocialAccount>(`/accounts/${accountId}/brand-voice`, {
      method: "PATCH",
      body: JSON.stringify({ brandVoiceId }),
    });
  },
};

// Add exports for user data compliance URLs
export const userDataApi = {
  // Facebook Data Deletion URL - for reference and documentation
  getDataDeletionUrl: () => `${EDGE_FUNCTION_URL}/instagram-auth/data-deletion`,
  
  // Privacy Policy URL - for reference and documentation
  getPrivacyPolicyUrl: () => `${EDGE_FUNCTION_URL}/instagram-auth/privacy-policy`,
  
  // Deauthorize Callback URL - for reference and documentation
  getDeauthorizeUrl: () => `${EDGE_FUNCTION_URL}/instagram-auth/deauthorize`,
};
