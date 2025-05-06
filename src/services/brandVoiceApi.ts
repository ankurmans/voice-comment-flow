
import { BrandVoice } from "../types";
import { fetchWithAuth } from "./fetchUtils";

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
