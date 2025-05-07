
import { fetchWithAuth } from "./fetchUtils";
import { mockDataService } from "./mockDataService";

export const commentsApi = {
  getAll: async (filters?: { status?: string; platform?: string; limit?: number }) => {
    // Return mock data instead of making an API call
    if (filters?.status === "pending") {
      return {
        data: {
          comments: mockDataService.getPendingComments(),
          totalCount: mockDataService.getPendingComments().length,
        },
        status: "success"
      };
    }
    
    // Real API call (commented out for now)
    // const queryParams = new URLSearchParams();
    // if (filters?.status) queryParams.append("status", filters.status);
    // if (filters?.platform) queryParams.append("platform", filters.platform);
    // if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    
    // const url = `/comments${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    // return fetchWithAuth(url);
    
    return {
      data: {
        comments: mockDataService.getPendingComments(),
        totalCount: mockDataService.getPendingComments().length
      },
      status: "success"
    };
  },
  
  sync: async () => {
    // Mock successful sync
    return {
      status: "success",
      data: {
        message: "Comments synced successfully",
        newComments: 5
      }
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth("/comments/sync", {
    //   method: "POST",
    // });
  },
  
  changeStatus: async (commentId: string, status: string) => {
    return fetchWithAuth(`/comments/${commentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
};
