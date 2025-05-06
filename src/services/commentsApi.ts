
import { Comment, ApiResponse } from "../types";
import { fetchWithAuth } from "./fetchUtils";

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
