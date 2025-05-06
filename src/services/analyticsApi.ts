
import { fetchWithAuth } from "./fetchUtils";

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
