
import { BrandVoice } from "../types";
import { fetchWithAuth } from "./fetchUtils";
import { supabase } from "@/integrations/supabase/client";

export const brandVoiceApi = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return { data, status: 'success' };
    } catch (error) {
      console.error("Error fetching brand voices:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return { data, status: 'success' };
    } catch (error) {
      console.error("Error fetching brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  create: async (data: Omit<BrandVoice, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data: newBrandVoice, error } = await supabase
        .from('brand_voices')
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;
      return { data: newBrandVoice, status: 'success' };
    } catch (error) {
      console.error("Error creating brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  update: async (id: string, data: Partial<BrandVoice>) => {
    try {
      const { data: updatedBrandVoice, error } = await supabase
        .from('brand_voices')
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return { data: updatedBrandVoice, status: 'success' };
    } catch (error) {
      console.error("Error updating brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase
        .from('brand_voices')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { data: { success: true }, status: 'success' };
    } catch (error) {
      console.error("Error deleting brand voice:", error);
      return { error: error instanceof Error ? error.message : "Unknown error", status: "error" };
    }
  },
};
