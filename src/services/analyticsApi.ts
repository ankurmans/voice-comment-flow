
import { fetchWithAuth } from "./fetchUtils";
import { mockDataService } from "./mockDataService";

export const analyticsApi = {
  getSummary: async (period: string = "week") => {
    // Return mock data instead of making an API call
    return {
      data: mockDataService.getAnalyticsSummary(period),
      status: "success"
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth<any>(`/analytics/summary?period=${period}`);
  },
  
  getCommentsByPlatform: async (period: string = "week") => {
    // Return mock data instead of making an API call
    return {
      data: mockDataService.getCommentsByPlatform(period),
      status: "success"
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth<any>(`/analytics/comments-by-platform?period=${period}`);
  },
  
  getEngagementMetrics: async (period: string = "week") => {
    // Return mock data instead of making an API call
    return {
      data: mockDataService.getEngagementMetrics(period),
      status: "success"
    };
    
    // Real API call (commented out for now)
    // return fetchWithAuth<any>(`/analytics/engagement?period=${period}`);
  },
};
