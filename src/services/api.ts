import { ApiResponse, Comment, Reply, SocialAccount, BrandVoice, GenerationRequest, GenerationResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
// Add the base URL for our Supabase Edge Function
const EDGE_FUNCTION_URL = "https://dedialilbuseilgqgmeh.supabase.co/functions/v1";

// Create fetch utility with error handling and authentication
const fetchWithAuth = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    // Get auth token from local storage
    const token = localStorage.getItem("auth_token");
    
    // Set default headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        error: data.error || "An error occurred", 
        status: "error" 
      };
    }

    return { data, status: "success" };
  } catch (error) {
    console.error("API request failed:", error);
    return { 
      error: error instanceof Error ? error.message : "Unknown error", 
      status: "error" 
    };
  }
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchWithAuth<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (email: string, password: string, name: string) => {
    return fetchWithAuth<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },
  
  logout: () => {
    localStorage.removeItem("auth_token");
  },
  
  getCurrentUser: async () => {
    return fetchWithAuth<{ user: any }>("/auth/user");
  },
};

// Social Accounts API
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
      
      // Redirect to the Instagram auth edge function
      window.location.href = `${EDGE_FUNCTION_URL}/instagram-auth/authorize`;
      
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

// Comments API
export const commentsApi = {
  getAll: async (filters?: { 
    status?: string; 
    platform?: string;
    accountId?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    
    return fetchWithAuth<{ comments: Comment[]; total: number; page: number }>(`/comments?${queryParams}`);
  },
  
  getById: async (commentId: string) => {
    return fetchWithAuth<Comment>(`/comments/${commentId}`);
  },
  
  updateStatus: async (commentId: string, status: Comment['status']) => {
    return fetchWithAuth<Comment>(`/comments/${commentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  
  sync: async (accountId?: string) => {
    const url = accountId ? `/comments/sync?accountId=${accountId}` : "/comments/sync";
    return fetchWithAuth<{ success: boolean; count: number }>(url, {
      method: "POST",
    });
  },
};

// Replies API
export const repliesApi = {
  generateReplies: async (data: GenerationRequest) => {
    return fetchWithAuth<GenerationResponse>("/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  saveReply: async (commentId: string, content: string) => {
    return fetchWithAuth<Reply>(`/comments/${commentId}/replies`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },
  
  postReply: async (replyId: string) => {
    return fetchWithAuth<Reply>(`/replies/${replyId}/post`, {
      method: "POST",
    });
  },
};

// Brand Voice API
export const brandVoiceApi = {
  getAll: async () => {
    return fetchWithAuth<BrandVoice[]>("/brand-voices");
  },
  
  getById: async (id: string) => {
    return fetchWithAuth<BrandVoice>(`/brand-voices/${id}`);
  },
  
  create: async (data: Omit<BrandVoice, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    return fetchWithAuth<BrandVoice>("/brand-voices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: Partial<BrandVoice>) => {
    return fetchWithAuth<BrandVoice>(`/brand-voices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return fetchWithAuth<{ success: boolean }>(`/brand-voices/${id}`, {
      method: "DELETE",
    });
  },
};

// Analytics API
export const analyticsApi = {
  getSummary: async (period: string = "week") => {
    return fetchWithAuth<any>(`/analytics/summary?period=${period}`);
  },
  
  getCommentsByPlatform: async (period: string = "week") => {
    return fetchWithAuth<any>(`/analytics/comments-by-platform?period=${period}`);
  },
  
  getEngagementMetrics: async (period: string = "week") => {
    return fetchWithAuth<any>(`/analytics/engagement?period=${period}`);
  },
};

// Add a new export for user data
export const userDataApi = {
  // Facebook Data Deletion URL - for reference and documentation
  // This is the URL you'll provide to Facebook for data deletion requests
  getDataDeletionUrl: () => `${EDGE_FUNCTION_URL}/instagram-auth/data-deletion`,
};
